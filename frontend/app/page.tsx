import Image from "next/image";
import Link from "next/link";

const LOGO_IMGS = [
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332871/bitcoin-btc-logo_tqby5m.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332871/bitcoin-cash-bch-logo_lvxwcn.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332871/dogecoin-doge-logo_fttfur.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332871/ethereum-eth-logo_z7bq1y.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332871/meme-meme-logo_mpx3pb.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332871/monero-xmr-logo_s3qfwp.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332873/onbeam-beam-logo_dj0gmw.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332873/pepe-pepe-logo_fjdecn.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332873/polkadot-new-dot-logo_ota3pu.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332873/qtum-qtum-logo_vqqtut.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332875/shiba-inu-shib-logo_vicnmq.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332877/solana-sol-logo_swa2xv.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332877/storj-storj-logo_ujqgvd.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332878/the-sandbox-sand-logo_pvmc0t.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332878/tron-trx-logo_pjway0.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332879/xrp-xrp-logo_iphlzz.svg',
  'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751332873/near-protocol-near-logo_czrfvf.svg',
];

const PORTFOLIO_OPTIONS = [
  {
    title: '라이징 스타',
    description: '📈 실시간 상승률 TOP 5',
    tendency: '지금 가장 핫한 코인으로 단기적인 수익을 기대하는 분에게 추천드려요!',
    stability: 4,
    profitability: 4,
  },
  {
    title: '베스트 셀러',
    description: '💸 24시간 거래대금 TOP 5',
    tendency: '활발한 거래가 이루어지는 인기 코인으로 단기적인 수익을 원하는 분에게 추천드려요!',
    stability: 3,
    profitability: 5,
  },
  {
    title: '자이언트',
    description: '🔍 시가총액 TOP 5',
    tendency: '시가총액 기반의 안정적이고 안정적 & 장기적인 수익을 기대하는 분에게 추천드려요!',
    stability: 5,
    profitability: 3,
  },
];

const Navbar = () => {
  return (
    <nav className="nav-layout bg-white">
      <div className="nav-contents px-4 lg:px-0">
        <div className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1751333125/logo_ejvz9u.avif"
            alt="EZBIT Logo"
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
        src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1751333127/home_background_xrtn76.avif"
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
    <section className="relative w-full flex items-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
      <div className="pt-2 sm:pt-4 flex gap-2 sm:gap-4 flex-shrink-0 animate-marquee whitespace-nowrap">
        {LOGO_IMGS.map((logo, i) => (
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
        {LOGO_IMGS.map((logo, i) => (
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

const Introduce = () => {
  return (
    <section className="contents-container pt-12 sm:pt-16 md:pt-20 px-4 lg:px-0 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10">
      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left">마음에 드는 옵션을 골라</h2>
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left">나만의 포트폴리오를 구성하세요</h2>
        </div>
        <p className="flex flex-col sm:flex-row gap-1 text-subtitle text-sm sm:text-base md:text-lg text-center md:text-left">
          <span className="font-bold">번거롭고 어려운 투자라고 생각하지 마세요!</span>
          <span className="font-bold">옵션을 선택하고 바로 포트폴리오를 만들어보세요</span>
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
      <Introduce />
      <section className="contents-container py-8 sm:py-10 md:py-12 px-4 lg:px-0 flex flex-col md:flex-row gap-4 sm:gap-6">
        {PORTFOLIO_OPTIONS.map((option, idx) => (
          <PortfolioCard key={idx} {...option} />
        ))}
      </section>
      <Footer />
    </main>
  );
}
