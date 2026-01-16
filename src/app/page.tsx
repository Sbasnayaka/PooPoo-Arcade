'use client'

import { useState } from 'react';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const userCode = "XST-2S5-SR5";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <main className="min-h-screen relative bg-deep-brown overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-tan to-transparent"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-display text-warm-tan text-center mb-12 drop-shadow-[6px_6px_0px_#000] rotate-1">
          PooPoo Arcade
        </h1>

        {/* Form Container */}
        <div className="bg-sand border-4 border-black shadow-[8px_8px_0px_#000] p-8 rotate-[-0.5deg]">
          <div className="space-y-6">
            {/* Partner Code Field */}
            <div>
              <label
                htmlFor="partner-code"
                className="block text-deep-brown font-display text-xl mb-2"
              >
                Partner code
              </label>
              <input
                id="partner-code"
                type="text"
                className="w-full px-4 py-3 border-4 border-black font-body text-lg bg-cream text-deep-brown focus:outline-none focus:ring-4 focus:ring-warm-tan shadow-[4px_4px_0px_#000]"
                placeholder="Enter partner code"
              />
            </div>

            {/* Your Code Field (Disabled) with Copy Button */}
            <div>
              <label
                htmlFor="your-code"
                className="block text-deep-brown font-display text-xl mb-2"
              >
                Your Code
              </label>
              <div className="relative">
                <input
                  id="your-code"
                  type="text"
                  disabled
                  value={userCode}
                  className="w-full px-4 py-3 pr-14 border-4 border-black font-body text-lg bg-rust text-cream cursor-not-allowed opacity-75 shadow-[4px_4px_0px_#000]"
                />
                <button
                  onClick={handleCopyCode}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-bronze transition-colors rounded border-2 border-black bg-mid-brown shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="text-xl">✓</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cream"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Flush Button - Log Shaped */}
        <button
          className="mt-8 w-full bg-bronze text-cream font-display text-2xl py-4 px-8 border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-rust transition-colors active:shadow-[4px_4px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] rounded-full relative overflow-hidden"
          style={{
            borderRadius: '50px / 35px',
            background: 'linear-gradient(135deg, #765341 0%, #6a4a3a 50%, #5b3e31 100%)'
          }}
        >
          <span className="relative z-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
            🪵 FLUSH 🪵
          </span>
          {/* Wood grain texture effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            }}></div>
          </div>
        </button>

        {/* Footer Text */}
        <p className="text-center text-rust font-irony mt-8 text-sm animate-pulse">
          Enter your partner code to proceed...
        </p>
      </div>
    </main>
  );
}
