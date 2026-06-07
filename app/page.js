import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Invest in Farmers, Harvest Hope
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Buy shares in agricultural yields, earn profits, and help reduce farmer debt. 
              Together, we can save lives and build sustainable farming.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/farmershares" className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition shadow-lg">
                Browse Opportunities
              </Link>
              <Link href="/about" className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition border-2 border-white">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">₹2.5Cr+</div>
              <div className="text-gray-600">Invested in Farmers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-gray-600">Farmers Helped</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">₹85L+</div>
              <div className="text-gray-600">Debt Reduced</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">18%</div>
              <div className="text-gray-600">Avg. Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-4">Browse Opportunities</h3>
              <p className="text-gray-600">Explore verified farming projects from trusted companies. See crop details, expected yields, and farmer stories.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-4">Buy Shares</h3>
              <p className="text-gray-600">Invest in agricultural yields by purchasing shares. Your investment directly supports farmers and reduces their debt.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-4">Earn & Impact</h3>
              <p className="text-gray-600">After harvest, profits are distributed based on your shares. You earn returns while helping save farmer lives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Mission: End Farmer Suicides</h2>
              <p className="text-lg text-gray-600 mb-4">
                Every year, thousands of farmers face crushing debt and despair. We're changing that by creating a sustainable investment model that:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Provides immediate financial relief to debt-ridden farmers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Shares profits fairly between investors and farmers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Creates sustainable income for farming families</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Builds trust through verified companies and transparent processes</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Profit Distribution Model</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">60%</div>
                    <div className="text-gray-600">To Investors</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">40%</div>
                    <div className="text-gray-600">To Farmers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-green-100">
            Start investing in farmers today. Earn returns while saving lives.
          </p>
          <Link href="/farmershares" className="inline-block bg-white text-green-700 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition shadow-lg">
            Start Investing Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
