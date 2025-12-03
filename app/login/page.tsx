'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          {/* IO Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-block bg-[#E74C3C] rounded-full p-6 mb-4 shadow-lg">
              <div className="text-6xl font-black text-[#F4D03F] tracking-wider" style={{ textShadow: '4px 4px 0px #C0392B' }}>
                IO
              </div>
            </div>
            <h1 className="text-4xl font-black text-[#F4D03F] mb-2" style={{ textShadow: '3px 3px 0px #C0392B' }}>
              GO.ALGO
            </h1>
            <p className="text-[#ECF0F1] text-sm font-semibold">INSIDE DAY</p>
          </div>

          {/* Pixelated divider */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-[#F4D03F]"></div>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#ECF0F1] text-sm font-bold mb-2">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a2332] text-white border-4 border-[#F4D03F] rounded-lg focus:outline-none focus:border-[#E74C3C] transition-colors font-semibold"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#ECF0F1] text-sm font-bold mb-2">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a2332] text-white border-4 border-[#F4D03F] rounded-lg focus:outline-none focus:border-[#E74C3C] transition-colors font-semibold"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-[#E74C3C] border-4 border-[#C0392B] text-white px-4 py-3 rounded-lg font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
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
                'PRESS START'
              )}
            </button>
          </form>

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
