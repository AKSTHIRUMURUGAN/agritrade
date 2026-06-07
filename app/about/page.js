import Link from 'next/link';

export const metadata = {
  title: 'About AgriTrade — Our Mission & Vision',
  description: 'Learn how AgriTrade is transforming agriculture through fractional investment, empowering farmers, and creating sustainable returns for investors.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About AgriTrade</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            We're building a transparent, technology-driven ecosystem that protects farmers,
            empowers investors, and ensures sustainable food production for India.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
              <p className="text-gray-600 text-lg mb-6">
                Every year, thousands of Indian farmers take their own lives due to crushing debt, 
                unpredictable weather, and exploitation by middlemen. They work the hardest yet 
                earn the least — trapped in a cycle they didn't create.
              </p>
              <div className="space-y-3">
                {[
                  'Farmer debt with no safety net',
                  'No access to affordable funding',
                  'Unpredictable climate destroying crops',
                  'Middlemen taking most of the profit',
                  'No technology support for small farmers',
                  'Income instability destroying families',
                ].map((problem) => (
                  <div key={problem} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="text-gray-700">{problem}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The AgriTrade Solution</h3>
              <div className="space-y-3">
                {[
                  'Fractional farm ownership for investors',
                  'Zero debt burden for farmers',
                  'Transparent profit sharing (60/40 model)',
                  'Verified projects with full documentation',
                  'Insurance-backed protection for all parties',
                  'Direct market access — no middlemen',
                ].map((solution) => (
                  <div key={solution} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Detailed */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">The AgriTrade Flow</h2>
          <div className="grid md:grid-cols-5 gap-4 items-start">
            {[
              {
                step: '01',
                title: 'Farmer Registers',
                desc: 'Farmer submits land details, crop plan, and funding requirements. KYC and document verification done by AgriTrade.',
                icon: '👨‍🌾',
              },
              {
                step: '02',
                title: 'Shares Created',
                desc: 'The required funding amount is split into affordable digital shares. e.g. ₹40,000 → 40 shares at ₹1,000 each.',
                icon: '🪙',
              },
              {
                step: '03',
                title: 'Investors Fund',
                desc: 'Investors browse verified projects, choose crops they believe in, and buy shares via secure Razorpay payments.',
                icon: '💰',
              },
              {
                step: '04',
                title: 'AgriTrade Manages',
                desc: 'AgriTrade provides seeds, fertilizers, equipment, soil testing, market analysis, transport, and insurance.',
                icon: '⚙️',
              },
              {
                step: '05',
                title: 'Profits Distributed',
                desc: 'After harvest, crops are sold. 60% of profits go to investors proportionally, 40% to farmers.',
                icon: '🌾',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-white rounded-2xl shadow p-6 mb-4">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-xs font-bold text-green-600 mb-2">STEP {item.step}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:flex justify-end items-center absolute">
                    <span className="text-green-400 text-2xl">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profit Model */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Profit Distribution Model</h2>
          <p className="text-center text-gray-600 mb-12">Every rupee of profit is split fairly and transparently</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center bg-green-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="text-5xl font-bold text-green-600 mb-2">60%</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">To Investors</div>
              <p className="text-gray-600 text-sm">Distributed proportionally based on shares owned</p>
            </div>
            <div className="text-center bg-amber-50 rounded-2xl p-8 border-2 border-amber-200">
              <div className="text-5xl font-bold text-amber-600 mb-2">40%</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">To Farmers</div>
              <p className="text-gray-600 text-sm">Plus a fixed salary during the cultivation period</p>
            </div>
            <div className="text-center bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="text-5xl font-bold text-blue-600 mb-2">5%</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Platform Fee</div>
              <p className="text-gray-600 text-sm">Covers management, insurance, tech & operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Our Impact So Far</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '₹2.5Cr+', label: 'Invested in Farmers' },
              { value: '1,200+', label: 'Farmers Helped' },
              { value: '₹85L+', label: 'Debt Reduced' },
              { value: '18%', label: 'Average Returns' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-4xl font-bold mb-2">{value}</div>
                <div className="text-green-100">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Real Impact Story</h2>
          <p className="text-center text-gray-600 mb-12">From our Solution Challenge deck</p>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-6">
              <div className="text-5xl flex-shrink-0">🍅</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tamil Nadu Tomato Farmer</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {[
                    { label: 'Funding Needed', value: '₹30,000' },
                    { label: 'Investors', value: '10 people' },
                    { label: 'Per Investor', value: '₹3,000' },
                    { label: 'Yield Increase', value: '+25%' },
                    { label: 'Investor Returns', value: '15%' },
                    { label: 'Farmer Debt', value: 'Cleared ✓' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mt-4 italic">
                  "Before AgriTrade, I was drowning in loans. Now my family eats well, 
                  my investors earned returns, and I'm planning next season." — Ravi, Tamil Nadu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Social Impact Goals</h2>
          <p className="text-center text-gray-600 mb-12">Aligned with UN Sustainable Development Goals</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🌾', title: 'Zero Hunger', desc: 'SDG-2: Ensuring food security through sustainable farming', color: 'green' },
              { icon: '💔', title: 'End Farmer Suicides', desc: 'Direct financial relief reduces debt-driven despair', color: 'red' },
              { icon: '🏘️', title: 'Rural Growth', desc: 'Creating economic opportunity in farming communities', color: 'amber' },
              { icon: '🌍', title: 'Sustainable Farming', desc: 'Promoting organic and environmentally responsible methods', color: 'emerald' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className={`bg-${color}-50 rounded-2xl p-6 text-center border border-${color}-100`}>
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-xl text-green-100 mb-8">
            Every share you buy is a vote of confidence in a farmer's future.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/farmershares"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition shadow-lg"
            >
              Start Investing
            </Link>
            <Link
              href="/register"
              className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition border-2 border-white"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
