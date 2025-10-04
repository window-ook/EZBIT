const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const WebSocket = require('ws')

const app = express()

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true
}))

app.use(express.json())

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS,
        methods: ["GET", "POST"],
        credentials: true
    }
})

let upbitWs = null
const connectedClients = new Set()
const subscribedMarkets = new Set()

const dataCache = {
    ticker: new Map(),
    candle: new Map(),
    orderbook: new Map(),
    trade: new Map(),
}

/** 웹소켓 매니저
 * @description 업비트 웹소켓 연결 관리 및 데이터 처리
 * @author 이창욱
 * @method connect 웹소켓 연결
 * @method subscribe 구독 요청
 * @method handleMessage 메시지 처리
 * @method handleTicker 현재가 데이터 처리
 * @method handleOrderbook 호가 데이터 처리
 * @method handleTrade 체결 데이터 처리
 * @method handleReconnect 재연결 처리
 */
class UpbitWebSocketManager {
    constructor() {
        this.ws = null
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
        this.reconnectDelay = 5000
    }

    connect() {
        try {
            this.ws = new WebSocket('wss://api.upbit.com/websocket/v1')

            this.ws.on('open', () => {
                console.log('✅ 업비트 웹소켓 연결 성공.')
                this.reconnectAttempts = 0
                this.subscribe()
            })

            this.ws.on('message', (data) => {
                this.handleMessage(data)
            })

            this.ws.on('close', (code, reason) => {
                console.log(`❗️ 웹소켓 연결 종료: ${code} ${reason}`)
                this.handleReconnect()
            })

            this.ws.on('error', (error) => {
                console.error('❗️ 웹소켓 연결 에러:', error)
                this.handleReconnect()
            })

            upbitWs = this.ws
        } catch (error) {
            console.error('❗️ 웹소켓 연결 요청 실패:', error)
            this.handleReconnect()
        }
    }

    subscribe() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const markets = Array.from(subscribedMarkets);

        if (markets.length === 0) return;

        // 구독 메시지 생성
        const subscribeMessage = [
            { ticket: 'UNIQUE_TICKET' },
            {
                type: 'ticker',
                codes: markets,
                isOnlySnapshot: false,
                isOnlyRealtime: true
            },
            {
                type: 'orderbook',
                codes: markets,
                isOnlySnapshot: false,
                isOnlyRealtime: true
            },
            {
                type: 'trade',
                codes: markets,
                isOnlySnapshot: false,
                isOnlyRealtime: true
            }
        ]

        console.log('📡 구독 요청:', markets)
        this.ws.send(JSON.stringify(subscribeMessage))
    }

    handleMessage(rawData) {
        try {
            // 업비트는 바이너리 데이터를 UTF-8로 디코딩
            const textData = rawData.toString('utf8')
            const data = JSON.parse(textData)

            // 데이터 타입별 처리: 현재가, 오더북, 체결내역
            switch (data.type) {
                case 'ticker':
                    this.handleTicker(data)
                    break
                case 'orderbook':
                    this.handleOrderbook(data)
                    break
                case 'trade':
                    this.handleTrade(data)
                    break
                default:
                    console.log('❌ 알 수 없는 데이터 타입:', data.type)
            }
        } catch (error) {
            console.error('메시지 파싱 에러:', error)
        }
    }

    handleTicker(data) {
        const tickerData = {
            code: data.code,
            trade_price: data.trade_price,
            change: data.change,
            change_price: data.change_price,
            change_rate: data.change_rate,
            high_price: data.high_price,
            low_price: data.low_price,
            highest_52_week_price: data.highest_52_week_price,
            lowest_52_week_price: data.lowest_52_week_price,
            prev_closing_price: data.prev_closing_price,
            signed_change_price: data.signed_change_price,
            signed_change_rate: data.signed_change_rate,
            trade_volume: data.trade_volume,
            acc_trade_volume_24h: data.acc_trade_volume_24h,
            acc_trade_price_24h: data.acc_trade_price_24h,
            trade_date: data.trade_date,
            trade_time: data.trade_time,
            trade_timestamp: data.trade_timestamp,
            timestamp: Date.now()
        }

        dataCache.ticker.set(data.code, tickerData)
        io.emit('ticker-update', tickerData)
    }

    handleOrderbook(data) {
        const orderbookData = {
            code: data.code,
            total_ask_size: data.total_ask_size,
            total_bid_size: data.total_bid_size,
            orderbook_units: data.orderbook_units.map(unit => ({
                ask_price: unit.ask_price,
                bid_price: unit.bid_price,
                ask_size: unit.ask_size,
                bid_size: unit.bid_size
            })),
            timestamp: data.timestamp
        }

        dataCache.orderbook.set(data.code, orderbookData)
        io.emit('orderbook-update', orderbookData)
    }

    handleTrade(data) {
        const tradeData = {
            code: data.code,
            trade_price: data.trade_price,
            trade_volume: data.trade_volume,
            ask_bid: data.ask_bid,
            prev_closing_price: data.prev_closing_price,
            change: data.change,
            change_price: data.change_price,
            trade_date: data.trade_date,
            trade_time: data.trade_time,
            trade_timestamp: data.trade_timestamp,
            timestamp: Date.now(),
            sequential_id: data.sequential_id
        }

        if (!dataCache.trade.has(data.code)) dataCache.trade.set(data.code, [])

        const trades = dataCache.trade.get(data.code)
        trades.unshift(tradeData)

        if (trades.length > 100) trades.pop()
        io.emit('trade-update', tradeData)
    }

    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) return
        this.reconnectAttempts++
        setTimeout(() => this.connect(), this.reconnectDelay)
    }

    addMarket(market) {
        subscribedMarkets.add(market)
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.subscribe()
    }

    removeMarket(market) {
        subscribedMarkets.delete(market)
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.subscribe()
    }

    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }
}

// 웹소켓 매니저 인스턴스
const wsManager = new UpbitWebSocketManager()

// Socket.IO 연결 처리
io.on('connection', (socket) => {
    console.log(`🔌 클라이언트 연결: ${socket.id}`)
    connectedClients.add(socket.id)

    // 첫 번째 클라이언트 연결 시 업비트 웹소켓 시작
    if (connectedClients.size === 1) wsManager.connect()

    // 연결 시 캐시된 최신 데이터 전송
    socket.emit('initial-data', {
        ticker: Object.fromEntries(dataCache.ticker),
        orderbook: Object.fromEntries(dataCache.orderbook),
        trade: Object.fromEntries(dataCache.trade)
    })

    // 마켓 구독 추가
    socket.on('subscribe-market', (market) => {
        console.log(`➕ 마켓 구독 추가: ${market}`)
        wsManager.addMarket(market)
    })

    // 마켓 구독 제거
    socket.on('unsubscribe-market', (market) => {
        console.log(`➖ 마켓 구독 제거: ${market}`)
        wsManager.removeMarket(market)
    })

    // 클라이언트 연결 해제
    socket.on('disconnect', () => {
        console.log(`🔌 클라이언트 연결 해제: ${socket.id}`)
        connectedClients.delete(socket.id)

        // 모든 클라이언트 연결 해제 시 업비트 웹소켓 종료
        if (connectedClients.size === 0) {
            console.log('📴 모든 클라이언트 연결 해제. 업비트 웹소켓 종료.')
            wsManager.disconnect()
        }
    })
})

// 서버 시작
const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`🚀 업비트 웹소켓 서버 실행`)
})

// 서버 종료
process.on('SIGTERM', () => {
    console.log('🛑 서버 종료 중...')
    wsManager.disconnect()
    server.close(() => {
        console.log('✅ 서버 종료 완료')
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('🛑 서버 종료 중...')
    wsManager.disconnect()
    server.close(() => {
        console.log('✅ 서버 종료 완료')
        process.exit(0)
    })
})