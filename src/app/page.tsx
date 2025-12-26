import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Purple Gradient Background with Abstract Patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-700 via-purple-600 to-purple-500">
        {/* Dot Pattern Grid */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)`,
            backgroundSize: '35px 35px',
          }}
        />
        
        {/* Abstract Shapes - Wavy Lines */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,80 Q250,40 500,80 T1000,80 T1500,80" stroke="white" strokeWidth="2.5" fill="none" />
          <path d="M0,180 Q350,130 700,180 T1400,180" stroke="#87CEEB" strokeWidth="2" fill="none" />
          <path d="M50,0 Q100,150 50,300 T50,600 T50,900" stroke="white" strokeWidth="2" fill="none" />
          <path d="M1200,50 Q1300,200 1200,350 T1200,650" stroke="#87CEEB" strokeWidth="2.5" fill="none" />
        </svg>

        {/* Abstract Shapes - Circles */}
        <div className="absolute top-16 left-16 w-10 h-10 border-2 border-white rounded-full opacity-35" />
        <div className="absolute top-12 left-12 w-3 h-3 bg-white rounded-full opacity-40" />
        <div className="absolute top-36 right-28 w-7 h-7 border-2 border-cyan-300 rounded-full opacity-35" />
        <div className="absolute bottom-28 left-36 w-12 h-12 border-2 border-white rounded-full opacity-30" />
        <div className="absolute top-64 right-64 w-8 h-8 border-2 border-cyan-300 rounded-full opacity-35" />
        <div className="absolute bottom-48 right-32 w-6 h-6 border-2 border-white rounded-full opacity-35" />

        {/* Abstract Shapes - X marks */}
        <div className="absolute top-56 right-56 opacity-35">
          <div className="relative w-7 h-7">
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white transform rotate-45 origin-center" />
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white transform -rotate-45 origin-center" />
          </div>
        </div>
        <div className="absolute bottom-56 right-36 opacity-35">
          <div className="relative w-9 h-9">
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-cyan-300 transform rotate-45 origin-center" />
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-cyan-300 transform -rotate-45 origin-center" />
          </div>
        </div>
        <div className="absolute top-80 left-80 opacity-30">
          <div className="relative w-6 h-6">
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white transform rotate-45 origin-center" />
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white transform -rotate-45 origin-center" />
          </div>
        </div>

        {/* Zigzag Lines */}
        <svg className="absolute bottom-20 left-20 opacity-30" width="60" height="40" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 L15,10 L30,20 L45,10 L60,20" stroke="#87CEEB" strokeWidth="2" fill="none" />
        </svg>
        <svg className="absolute top-32 right-20 opacity-30" width="50" height="30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,15 L12,8 L24,15 L36,8 L50,15" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-purple-900 mb-4 leading-tight">
                SHOP ONLINE
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-cyan-400 mb-6">
                SALES LANDING PAGE
              </h2>
              <p className="text-lg md:text-xl text-white mb-8 max-w-lg">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
              </p>
              <Link
                href="/products"
                className="inline-block bg-cyan-400 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-purple-600 transition-colors shadow-lg hover:shadow-xl"
              >
                SHOP NOW
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative w-full h-[500px] lg:h-[600px] z-10">
              <Image
                src="/freepik-assets/Gemini_Generated_Image_srpzx0srpzx0srpz.png"
                alt="Happy shopper with shopping bags"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Freepik Attribution */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-white text-sm opacity-80">
          ❤️
        </p>
      </footer>
    </div>
  );
}
