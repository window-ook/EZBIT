'use client';

import { useState } from 'react';
import { IMAGE_PATHS } from '@/lib/imagePaths';
import { PORTFOLIO_OPTIONS } from '@/utils/constants/portfolioPilot';
import Image from "next/image";

const IntroduceRealtimeExchange = () => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10">
      {/* 좌측 */}
      <div className='w-full md:w-1/2 h-60 md:h-80 flex justify-center items-center rounded-xl shadow-lg overflow-hidden'>
        <Image
          src={IMAGE_PATHS.LANDING_EXCHANGE_CAPTURED}
          alt="EZBIT 실시간 거래소 화면"
          priority={true}
          quality={90}
          width={640}
          height={480}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      {/* 우측 */}
      <div className='flex-1 flex flex-col items-center md:items-start gap-4 justify-center'>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left text-white">실시간 거래소</p>
        <span className="text-center md:text-left text-sm sm:text-base md:text-lg text-white/80 font-semibold">실감나는 투자 환경을 경험하세요</span>
        <span className="text-center md:text-left text-xs sm:text-sm md:text-base text-white/70">실시간 시세와 호가창으로 마치 진짜 거래소처럼 투자를 체험할 수 있습니다.</span>
      </div>
    </div>
  );
};

const PortfolioCard = ({ title, description, tendency }: { title: string, description: string, tendency: string }) => {
  return (
    <article className="relative p-4 sm:p-6 rounded-xl shadow-md border border-white/30 bg-white/10 backdrop-blur-sm flex-1 flex flex-col gap-3 sm:gap-4 hover:border-slate-500/70 hover:bg-slate-500/60 transition min-h-[180px]">
      <span className="font-bold text-base sm:text-lg md:text-xl text-white">{title}</span>
      <p className="text-white/80 text-xs sm:text-sm md:text-base">{description}</p>
      <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{tendency}</p>
    </article>
  );
};

const IntroducePilotAndPortfolio = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8">
      {/* 설명 */}
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left text-white">마음에 드는 옵션을 골라보세요</h2>
        <p className="flex flex-col gap-1 text-sm sm:text-base md:text-lg text-center md:text-left">
          <span className="font-semibold text-white/80">번거롭고 어려운 투자라고 생각하지 마세요!</span>
          <span className="font-semibold text-white/80">간단하게 포트폴리오 완성!</span>
        </p>
      </div>

      {/* 포트폴리오 카드들 */}
      <div className="flex flex-col md:flex-row gap-4">
        {PORTFOLIO_OPTIONS.map((option) => {
          const { key, ...rest } = option;
          return <PortfolioCard key={key} {...rest} />;
        })}
      </div>
    </div>
  );
};

const IntroduceTrends = () => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10">
      {/* 좌측: 설명 */}
      <div className='flex-1 flex flex-col gap-4 justify-center'>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left text-white">트렌드 페이지</p>
        <span className="text-center md:text-left text-sm sm:text-base md:text-lg text-white/80 font-semibold">암호화폐 시장의 최신 동향을 한눈에</span>
        <span className="text-center md:text-left text-xs sm:text-sm md:text-base text-white/70">실시간 뉴스, 이슈 분석, 그리고 유튜브 영상까지. 투자에 필요한 모든 정보를 모았습니다.</span>
      </div>

      {/* 우측: 디자인 컴포넌트 */}
      <div className='w-full md:w-1/2 flex flex-col gap-3 p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg'>
        <div className='flex items-center gap-3 pb-3 border-b border-white/20'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-main-light to-main flex items-center justify-center text-white font-bold'>📈</div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-bold text-white'>시황 분석</span>
            <span className='text-2xs text-white/60'>실시간 업데이트</span>
          </div>
        </div>
        <div className='flex items-center gap-3 pb-3 border-b border-white/20'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold'>🎯</div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-bold text-white'>주요 이슈</span>
            <span className='text-2xs text-white/60'>핵심 토픽 정리</span>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold'>📺</div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-bold text-white'>영상 콘텐츠</span>
            <span className='text-2xs text-white/60'>전문가 의견</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CarouselContainer() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { id: 0, component: <IntroduceRealtimeExchange /> },
    { id: 1, component: <IntroducePilotAndPortfolio /> },
    { id: 2, component: <IntroduceTrends /> }
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24">
      <div className="contents-container px-4 lg:px-0">
        {/* 메인 컨테이너 - Navbar 스타일과 동일 */}
        <div className="relative rounded-2xl backdrop-blur-md bg-black/30 border border-white/20 shadow-lg shadow-black/10 p-8 sm:p-10 md:p-12 lg:p-16">
          {/* 우측 상단 버튼들 */}
          <div className="absolute top-6 right-6 flex gap-2">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(slide.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${activeIndex === slide.id
                  ? 'bg-white/90 text-slate-900 shadow-md'
                  : 'bg-white/30 text-white/70 hover:bg-white/20 hover:text-white/90'
                  } cursor-pointer`}
              >
              </button>
            ))}
          </div>

          {/* 슬라이드 컨텐츠 */}
          <div className="mt-8 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center">
            <div className="w-full animate-fadeIn">
              {slides[activeIndex].component}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}