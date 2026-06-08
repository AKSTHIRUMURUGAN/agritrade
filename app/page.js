'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('farmer');

  // Unified data structure for the 3 pillars
  const pillars = {
    farmer: {
      title: 'Farmers',
      role: 'THE CULTIVATOR',
      icon: '👨‍🌾',
      description: 'Reducing farmer debt by enabling modern community financing and guaranteed operational salaries.',
      color: 'emerald',
      work: [
        'Preparation of soil & land leveling',
        'Sowing premium seeds',
        'Adding organic manures & fertilizer',
        'Controlled irrigation management',
        'Weeding and crop health monitoring',
        'Harvesting at optimal ripeness',
        'Threshing & processing yield',
        'Safe warehouse storage & distribution'
      ],
      benefits: [
        { label: 'Zero Investment', desc: 'No upfront capital needed for seeds, tools, or resources.' },
        { label: 'No Risk Burden', desc: 'Protected from crop failure, dry seasons, and market drops.' },
        { label: 'Agritech Guidance', desc: 'Professional advice and support from agronomists.' },
        { label: 'All Resources Supplied', desc: 'High-quality seeds, machinery, and fertilizer provided.' },
        { label: 'No Logistics Hassle', desc: 'No matching with buyers or local transportation headaches.' }
      ],
      profits: [
        { title: 'Operational Salary', value: 'Earn direct wages for every stage of completed work.' },
        { title: 'Product Profit Share', value: 'Receive a structured bonus share from final harvest sales.' },
        { title: 'Guaranteed Fixed Rate', value: 'Shielded from crop price crashes with pre-committed rates.' }
      ]
    },
    investor: {
      title: 'Investors',
      role: 'THE FINANCIER',
      icon: '📈',
      description: 'Smarter agricultural asset management with high yields and collateral-based security.',
      color: 'yellow',
      work: [
        'Browse and buy fractional land stocks or crop shares',
        'Hold shares securely in the digital wallet portfolio',
        'Monitor farm progress & milestone updates via dashboard',
        'Wait for the pre-defined crop duration',
        'Sell shares at completion or hold for appreciation',
        'Manage wallet withdrawal and profits seamlessly'
      ],
      benefits: [
        { label: 'Zero Daily Checkups', desc: 'No manual labor or constant tracking required.' },
        { label: 'Anti-Volatility Shield', desc: 'Safe from sudden stock market crashes or drops.' },
        { label: 'Crop Loan Protection', desc: 'Capital secured by localized crop insurance reserves.' },
        { label: 'Transparent Ledger', desc: '100% verified lands, KYC, and soil health checks.' },
        { label: '24/7 Client Support', desc: 'Dedicated client success managers always available.' },
        { label: 'Instant Coin Withdrawals', desc: 'Payouts processed directly through your secure UPI/Bank wallet.' }
      ],
      profits: [
        { title: 'Yield Return', value: 'Earn direct profits from physical product harvest sales.' },
        { title: 'Asset Appreciation', value: 'Capital gains on rising value of verified land stocks.' },
        { title: 'Early-Bird Margin', value: 'Enjoy discounted entry prices on newly opened land opportunities.' }
      ]
    },
    agritrade: {
      title: 'Agri Trade',
      role: 'THE FACILITATOR',
      icon: '🤝',
      description: 'Connecting farmers and investors while providing end-to-end supply chain infrastructure.',
      color: 'sky',
      work: [
        'Community agricultural financing & smart ledger control',
        'Bulk supply of certified high-grade seeds & fertilizer',
        'State-of-the-art crop processing & packaging',
        'High-end machinery & drone equipment leasing',
        'Scientific agronomy consulting & soil laboratory tests',
        'Cold chain logistics & secure farm transportation',
        'Brand marketing, distribution, and corporate retail sales',
        'Value-add food processing (jams, flours, oils)',
        'Global export supply chain management',
        'Agri-tourism development'
      ],
      benefits: [
        { label: 'Low Capital Investment', desc: 'Crowdfunded model reduces heavy operational debt.' },
        { label: 'Distributed Risk', desc: 'Financing distributed globally across micro-investors.' },
        { label: 'Integrated Tech Suite', desc: 'SaaS-enabled monitoring from seeding to export logistics.' },
        { label: 'Agribusiness Training', desc: 'Standardized farming frameworks for higher yields.' }
      ],
      profits: [
        { title: 'Service Wages', value: 'Earn stable service income from machinery leasing & consulting.' },
        { title: 'Global Export Margins', value: 'Direct premium profit margins from international exports.' },
        { title: 'Platform Commissions', value: 'Small transaction fees on trade listings & payouts.' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1712] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 max-w-7xl mx-auto text-center">
        <span className="px-3.5 py-1 bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 rounded-full text-xs font-bold tracking-wider uppercase mb-6 inline-block">
          🌾 The Future of Agri-Wealth
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none max-w-4xl mx-auto">
          Invest in Farmers, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-300">Harvest Hope</span>
        </h1>
        <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Buy fractional shares in high-yield lands and crop harvests. Secure stable returns while reducing farmer debt and preventing agricultural distress.
        </p>

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            href="/farmershares"
            className="px-8 py-3.5 bg-emerald-500 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-emerald-400 hover:scale-[1.02] transition shadow-lg shadow-emerald-500/10"
          >
            Browse Opportunities
          </Link>
          {user ? (
            <Link
              href="/user"
              className="px-8 py-3.5 bg-zinc-800 border border-emerald-900/40 text-zinc-200 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-zinc-700 transition"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-zinc-900 transition"
            >
              Investor Login
            </Link>
          )}
        </div>
      </section>

      {/* Trust & Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 py-8 border-y border-emerald-900/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block">₹2.5Cr+</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest block mt-1">Total Financed</span>
          </div>
          <div className="border-l border-emerald-900/30">
            <span className="text-2xl sm:text-3xl font-black text-white block">1,200+</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest block mt-1">Farmers Guided</span>
          </div>
          <div className="border-l border-emerald-900/30">
            <span className="text-2xl sm:text-3xl font-black text-white block">100%</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest block mt-1">Verified Lands</span>
          </div>
          <div className="border-l border-emerald-900/30">
            <span className="text-2xl sm:text-3xl font-black text-white block">18.4%</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest block mt-1">Average Yield</span>
          </div>
        </div>
      </section>

      {/* The WIN-WIN-WIN Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Cooperative Synergy</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mt-1">
            The Win-Win-Win Ecosystem
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto mt-2 leading-relaxed">
            AgriTrade eliminates intermediaries by establishing a balanced, community-funded model that rewards all participants.
          </p>
        </div>

        {/* Dynamic Selector Tabs */}
        <div className="bg-[#15231A]/70 border border-emerald-900/40 rounded-2xl p-1.5 max-w-md mx-auto mb-10 flex justify-between">
          {Object.keys(pillars).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 ${
                activeTab === key
                  ? 'bg-emerald-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {pillars[key].title}
            </button>
          ))}
        </div>

        {/* Tab Detail view */}
        <div className="bg-[#15231A]/40 border border-emerald-900/20 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl relative">
          <div className="absolute top-4 right-6 text-7xl opacity-[0.04] pointer-events-none select-none">
            {pillars[activeTab].icon}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Block: Summary & Profits */}
            <div className="lg:w-2/5 space-y-6">
              <div>
                <span className="text-[9px] font-black text-emerald-400 tracking-widest block mb-1 uppercase">
                  {pillars[activeTab].role}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                  {pillars[activeTab].icon} For {pillars[activeTab].title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {pillars[activeTab].description}
                </p>
              </div>

              {/* Profits */}
              <div className="space-y-3 pt-3 border-t border-emerald-900/30">
                <h4 className="text-[10px] font-black tracking-wider text-emerald-300 uppercase">
                  Profit Streams
                </h4>
                {pillars[activeTab].profits.map((p, idx) => (
                  <div key={idx} className="bg-[#1A281E]/60 border border-emerald-900/30 p-3 rounded-xl">
                    <span className="text-xs font-bold text-white block">{p.title}</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Block: Work & Benefits */}
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {/* Work */}
              <div className="bg-[#1A281E]/30 p-5 rounded-2xl border border-emerald-900/20 space-y-3">
                <h4 className="text-[10px] font-black tracking-wider text-emerald-300 uppercase border-b border-emerald-900/30 pb-2">
                  💼 Structured Work & Processes
                </h4>
                <ul className="space-y-2.5">
                  {pillars[activeTab].work.map((w, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-zinc-300">
                      <span className="text-emerald-500 font-mono">{idx + 1}.</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-[#1A281E]/30 p-5 rounded-2xl border border-emerald-900/20 space-y-3">
                <h4 className="text-[10px] font-black tracking-wider text-emerald-300 uppercase border-b border-emerald-900/30 pb-2">
                  ✨ System Benefits
                </h4>
                <ul className="space-y-3.5">
                  {pillars[activeTab].benefits.map((b, idx) => (
                    <li key={idx} className="space-y-0.5">
                      <div className="flex gap-1.5 items-center">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-xs font-bold text-white">{b.label}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 pl-4 leading-normal">{b.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Map */}
      <section className="bg-[#0A120E] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Platform Mechanism</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mt-1">Ecosystem Flow Map</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-[#15231A]/40 border border-emerald-900/30 rounded-2xl p-6 relative">
              <span className="absolute top-4 right-4 text-xs font-mono text-zinc-600 font-black">01</span>
              <div className="text-3xl mb-3">💰</div>
              <h4 className="text-sm font-bold text-white uppercase">Finance & Investment</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Investors purchase land stocks or crop shares, pooling funds into secure wallets. AgriTrade distributes funds to purchase top-tier seed and equipment leasing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#15231A]/40 border border-emerald-900/30 rounded-2xl p-6 relative">
              <span className="absolute top-4 right-4 text-xs font-mono text-zinc-600 font-black">02</span>
              <div className="text-3xl mb-3">🚜</div>
              <h4 className="text-sm font-bold text-white uppercase">Cultivation & Milestones</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Farmers execute soil preparation, sowing, and harvesting. They receive regular salaries from the platform, while agronomists monitor quality and update logs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#15231A]/40 border border-emerald-900/30 rounded-2xl p-6 relative">
              <span className="absolute top-4 right-4 text-xs font-mono text-zinc-600 font-black">03</span>
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="text-sm font-bold text-white uppercase">Yield Processing & Sale</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                AgriTrade processes, packages, and exports products. Profits are deposited back into wallets (60% to Investors, 40% yield share bonus to Farmers).
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Profit Model */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Yield Model</span>
            <h2 className="text-3xl font-black text-white uppercase tracking-wider mt-1">Sustainable Profit Distribution</h2>
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              We leverage an ethical distribution model designed to ensure continuous farming without debt. Traditional crop cycles leave farmers with dry periods. AgriTrade secures guaranteed operational wages during growth phases, followed by a share of harvest sales.
            </p>
            <ul className="mt-6 space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Structured monthly operational salary for the farming workforce.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Collateralized crop protection safeguards micro-investor capital.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Automatic 60/40 ledger splits handled transparently on the block database.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#15231A]/40 border border-emerald-900/25 p-8 rounded-3xl text-center space-y-6">
            <div>
              <span className="text-5xl block mb-2">📊</span>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Revenue Split Model</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1A281E]/60 border border-emerald-950 p-5 rounded-2xl">
                <span className="text-3xl font-black text-emerald-400 block">60%</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 block">To Investors</span>
              </div>
              <div className="bg-[#1A281E]/60 border border-emerald-950 p-5 rounded-2xl">
                <span className="text-3xl font-black text-yellow-400 block">40%</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 block">To Farmers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#15231A] to-[#0E1712] py-20 px-4 text-center border-t border-emerald-900/20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Join India's Agri-Revolution</h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Fund agricultural growth, secure fixed asset-backed returns, and help build a suicide-free farming environment across rural communities.
          </p>
          <Link
            href="/farmershares"
            className="inline-block px-10 py-4 bg-emerald-500 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-emerald-400 hover:scale-[1.02] transition shadow-lg shadow-emerald-500/10"
          >
            Start Investing Now
          </Link>
        </div>
      </section>

    </div>
  );
}
