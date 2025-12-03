'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5DADE2] via-[#87CEEB] to-[#F4D03F] relative overflow-hidden">
      {/* Pixelated clouds */}
      <div className="absolute top-20 left-10 w-32 h-16 bg-white opacity-80 rounded-full"></div>
      <div className="absolute top-40 right-20 w-40 h-20 bg-white opacity-80 rounded-full"></div>
      <div className="absolute top-60 left-1/4 w-36 h-18 bg-white opacity-80 rounded-full"></div>
      
      {/* Brown platform at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-[#8B4513] to-[#654321]">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#D2691E]"></div>
      </div>

      {/* Ladders */}
      <div className="absolute bottom-32 left-20 w-12 h-48 flex flex-col justify-between">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-1 bg-[#FF6B6B] rounded"></div>
        ))}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B6B]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF6B6B]"></div>
      </div>

      {/* Barrels */}
      <div className="absolute bottom-40 right-32 w-16 h-20 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-lg border-4 border-[#D2691E]">
        <div className="absolute top-2 left-2 right-2 h-1 bg-[#D2691E]"></div>
        <div className="absolute bottom-2 left-2 right-2 h-1 bg-[#D2691E]"></div>
      </div>

      {/* Login Container */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-2xl shadow-2xl p-12 border-8 border-[#E74C3C] max-w-md w-full transform hover:scale-105 transition-transform duration-300">
          {/* DK Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-block bg-[#E74C3C] rounded-full p-6 mb-4 shadow-lg">
              <div className="text-6xl font-black text-[#F4D03F] tracking-wider" style={{ textShadow: '4px 4px 0px #C0392B' }}>
                DK
              </div>
            </div>
            <h1 className="text-4xl font-black text-[#F4D03F] mb-2" style={{ textShadow: '3px 3px 0px #C0392B' }}>
              GO.ALGO
            </h1>
            <p className="text-[#ECF0F1] text-sm font-semibold">🍌 BARREL BLAST TRADING 🍌</p>
          </div>

          {/* Pixelated divider */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-[#F4D03F]"></div>
            ))}
          </div>

          {/* Sign in button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#E74C3C] to-[#C0392B] hover:from-[#C0392B] hover:to-[#E74C3C] text-white font-black text-xl py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border-4 border-[#F4D03F] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>LOADING...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>PRESS START</span>
              </div>
            )}
          </button>

          {/* Authorized user notice */}
          <div className="mt-6 text-center">
            <div className="inline-block bg-[#F4D03F] px-4 py-2 rounded-lg border-2 border-[#E74C3C]">
              <p className="text-[#2C3E50] text-xs font-bold">🍌 AUTHORIZED KONG ONLY 🍌</p>
            </div>
          </div>

          {/* Pixelated footer */}
          <div className="mt-8 flex justify-center gap-1">
            {[...Array(15)].map((_, i) => (
              <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-[#E74C3C]' : 'bg-[#F4D03F]'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating bananas */}
      <div className="absolute top-1/4 right-1/4 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>
        🍌
      </div>
      <div className="absolute top-1/3 left-1/3 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>
        🍌
      </div>
      <div className="absolute bottom-1/3 right-1/3 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>
        🍌
      </div>
    </div>
  );
}
