import { IMAGE_PATHS, COIN_LOGOS } from '@/lib/imagePaths';
import { PORTFOLIO_OPTIONS } from '@/constants/portfolioPilot';
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="nav-layout bg-white">
      <div className="nav-contents px-4 lg:px-0">
        <div className="flex items-center gap-2">
          <Image
            src={IMAGE_PATHS.LOGO}
            alt="로고 이미지"
            width={100}
            height={100}
            className="size-7 sm:size-8 rounded-md"
          />
          <h1 className="text-xl sm:text-2xl text-main-light font-bold">EZBIT</h1>
        </div>
        <Link
          href="/exchange"
        >
          <span className="text-sm sm:text-base text-main-light font-bold">시작하기</span>
        </Link>
      </div>
    </nav>
  );
};

const Header = () => {
  return (
    <header className="relative w-full flex flex-col justify-center items-center py-20 sm:py-32 md:py-40">
      <Image
        src={IMAGE_PATHS.LANDING_BACKGROUND}
        alt="배경 이미지"
        priority={true}
        quality={100}
        width={2000}
        height={1200}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <section className='flex flex-col gap-3 sm:gap-4 px-4'>
        <h1 className="relative text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center text-white text-shadow-black">
          투자를 재미있고 쉽게
        </h1>
        <p className="relative text-sm sm:text-lg md:text-2xl lg:text-3xl font-semibold text-center text-white text-shadow-black">
          포트폴리오 파일럿이 스마트한 포트폴리오를 추천해드려요
        </p>
        <div className="relative flex flex-wrap gap-2 sm:gap-4 justify-center">
          <span className="font-semibold text-xs sm:text-lg text-white text-shadow-black">#모의투자</span>
          <span className="font-semibold text-xs sm:text-lg text-white text-shadow-black">#포트폴리오 파일럿</span>
        </div>
      </section>
    </header>
  );
};

const Marquee = () => {
  return (
    <section className="relative w-full bg-white flex items-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
      <div className="pt-2 sm:pt-4 flex gap-2 sm:gap-4 flex-shrink-0 animate-marquee whitespace-nowrap">
        {COIN_LOGOS.map((logo, i) => (
          <Image
            key={logo + i}
            src={logo}
            alt="coin logo"
            width={40}
            height={40}
            className="inline-block size-6 sm:size-8 md:size-12 lg:size-20"
          />
        ))}
      </div>
      <div className="pt-2 sm:pt-4 flex gap-2 sm:gap-4 flex-shrink-0 animate-marquee2 whitespace-nowrap">
        {COIN_LOGOS.map((logo, i) => (
          <Image
            key={logo + '2-' + i}
            src={logo}
            alt="coin logo"
            width={40}
            height={40}
            className="inline-block size-6 sm:size-8 md:size-12 lg:size-20"
          />
        ))}
      </div>
    </section>
  );
};

const IntroduceRealtimeExchange = () => {
  return (
    <section className='w-full bg-white'>
      <div className="contents-container py-12 sm:py-16 md:py-20 px-4 lg:px-0 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10">
        {/* 좌측 */}
        <div className='w-1/3 h-80 flex justify-center items-center rounded-lg shadow-lg overflow-hidden'>
          <Image
            src={IMAGE_PATHS.LANDING_EXCHANGE_CAPTURED}
            alt="EZBIT 실시간 거래소 화면"
            priority={true}
            quality={90}
            width={640}
            height={480}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* 우측 */}
        <div className='flex-1 flex flex-col items-center md:items-end gap-4 justify-center'>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-right">실시간 거래소</p>
          <span className="text-center md:text-right text-sm sm:text-base md:text-lg lg:text-xl text-subtitle font-bold">실시간으로 업데이트 정보로 실감나는 투자 환경을 경험하실 수 있습니다</span>
        </div>
      </div>
    </section>
  );
};

const IntroducePilot = () => {
  return (
    <section className="contents-container pt-12 sm:pt-16 md:pt-20 px-4 lg:px-0 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10">
      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left">마음에 드는 옵션을 골라보세요</h2>
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left">파일럿이 매수 리스트를 만들어드려요</h2>
        </div>
        <p className="flex flex-col sm:flex-row gap-1 text-subtitle text-sm sm:text-base md:text-lg text-center md:text-left">
          <span className="font-bold">번거롭고 어려운 투자라고 생각하지 마세요!</span>
          <span className="font-bold">딸깍하면 포트폴리오 완성!</span>
        </p>
      </div>
    </section>
  );
};

const PortfolioCard = ({ title, description, tendency }: { title: string, description: string, tendency: string }) => {
  return (
    <article className="relative p-4 sm:p-6 rounded-lg shadow-lg border bg-white flex-1 flex flex-col gap-3 sm:gap-4 hover:border-main-light transition min-h-[200px] sm:min-h-[220px]">
      <span className="font-bold text-lg sm:text-xl md:text-2xl text-main-light">{title}</span>
      <p className="text-description text-sm sm:text-base">{description}</p>
      <p className="text-description text-sm sm:text-base leading-relaxed">{tendency}</p>
    </article>
  );
};

const Footer = () => {
  return (
    <footer className="contents-container py-6 sm:py-8 px-4 lg:px-0 text-center text-subtitle text-xs sm:text-sm">
      Copyright © EZBIT 2025. All rights reserved.
    </footer>
  );
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <Header />
      <Marquee />
      <IntroduceRealtimeExchange />
      <IntroducePilot />
      <section className="contents-container py-8 sm:py-10 md:py-12 px-4 lg:px-0 flex flex-col md:flex-row gap-4 sm:gap-6">
        {PORTFOLIO_OPTIONS.map((option) => {
          const { key, ...rest } = option;
          return <PortfolioCard key={key} {...rest} />;
        })}
      </section>
      <Footer />
    </main>
  );
}