import { IMAGE_PATHS, COIN_LOGOS } from '@/lib/imagePaths';
import { Github } from 'lucide-react';
import Image from "next/image";
import CarouselContainer from '@/components/landing/CarouselContainer';

const Header = () => {
  return (
    <header className="relative w-full py-20 sm:py-32 md:py-40 flex flex-col justify-center items-center">
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

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900/50 text-slate-300 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href="https://github.com/window-ook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-main group flex items-center gap-2 text-sm font-medium transition-colors text-white"
            >
              <span>Developed by</span>
              <Github className="size-4 transition-transform group-hover:scale-110" />
              <span className="font-bold">window-ook</span>
            </a>
            <div className="text-xs sm:text-sm text-slate-200">
              Copyright © EZBIT. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <Marquee />
      <CarouselContainer />
      <Footer />
    </main>
  );
}