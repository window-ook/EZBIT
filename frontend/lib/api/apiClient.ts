import { CONSOLE_ERROR } from '@/constants/messages';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

interface IFetchOptions extends RequestInit {
    next?: { revalidate?: number },
    cache?: 'force-cache' | 'no-store';
}

type RequestDomain = 'local' | 'websocket' | 'external';

/**
 * 커스텀 Fetch 클라이언트
 * @param url 요청 URL
 * @param options 요청 옵션
 * @param domain 요청 도메인 타입
 * @returns {T} Response JSON
 */
export async function apiClient<T = unknown>(
    url: string,
    options?: IFetchOptions,
    domain: RequestDomain = 'local'
): Promise<T> {
    const defaultHeaders = { 'Content-Type': 'application/json' };

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options?.headers || {}),
        },
    };

    let fullUrl: string;

    switch (domain) {
        case 'websocket':
            const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER;
            fullUrl = `${websocketUrl}${url}`;
            break;
        case 'external':
            fullUrl = url;
            break;
        default:
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            if (!baseUrl) throw new Error(CONSOLE_ERROR.API_CLIENT_BASE_URL_UNDEFINED);
            fullUrl = `${baseUrl}${url}`;
            break;
    }

    const response = await fetch(fullUrl, mergedOptions);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}