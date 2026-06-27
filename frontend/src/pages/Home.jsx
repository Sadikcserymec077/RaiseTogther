import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Medical', icon: '🏥', slug: 'MEDICAL' },
  { label: 'Education', icon: '📚', slug: 'EDUCATION' },
  { label: 'Startup', icon: '🚀', slug: 'STARTUP' },
  { label: 'Disaster Relief', icon: '🆘', slug: 'DISASTER_RELIEF' },
  { label: 'Animal Welfare', icon: '🐾', slug: 'ANIMAL_WELFARE' },
  { label: 'Social Cause', icon: '🤝', slug: 'SOCIAL_CAUSE' },
];

const STATS = [
  { value: '₹10M+', label: 'Raised' },
  { value: '50k+', label: 'Donations' },
  { value: '1,200+', label: 'Campaigns' },
  { value: '30k+', label: 'Users' },
];

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            🇮🇳 India's Most Trusted Crowdfunding Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight">
            Empowering campaigns.<br className="hidden sm:block" /> Connecting hearts.<br className="hidden sm:block" /> Changing lives.
          </h1>
          <p className="text-base sm:text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            Join thousands of donors making a real impact every single day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/campaigns"
              className="bg-white text-indigo-700 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors text-sm sm:text-base"
            >
              Explore Campaigns
            </Link>
            <Link
              to="/campaigns/create"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white hover:text-indigo-700 transition-colors text-sm sm:text-base"
            >
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-14 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-4xl font-bold text-indigo-600">{s.value}</p>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/campaigns?category=${cat.slug}`}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col items-center justify-center transition-all hover:-translate-y-0.5"
            >
              <span className="text-2xl sm:text-3xl mb-2 sm:mb-3">{cat.icon}</span>
              <span className="font-semibold text-gray-800 text-center text-xs sm:text-sm leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Campaigns placeholder */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trending Campaigns</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Campaigns gaining momentum right now.</p>
            </div>
            <Link to="/campaigns" className="text-indigo-600 font-semibold hover:underline text-sm sm:text-base whitespace-nowrap">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                to="/campaigns"
                className="bg-white rounded-xl shadow-sm hover:shadow-md h-52 sm:h-64 flex flex-col items-center justify-center text-gray-400 border border-gray-100 transition-all hover:-translate-y-0.5"
              >
                <span className="text-4xl mb-3">🎯</span>
                <span className="text-sm font-medium">Browse Campaigns</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Donors / CTA */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="text-white text-center sm:text-left sm:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Our Top Donors</h2>
            <p className="text-indigo-100 mb-6 text-sm sm:text-base">These incredible individuals have gone above and beyond to make a difference.</p>
            <Link
              to="/leaderboard"
              className="inline-block bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors text-sm sm:text-base"
            >
              View Leaderboard &rarr;
            </Link>
          </div>
          <div className="sm:w-1/2 grid grid-cols-3 gap-3 w-full max-w-xs sm:max-w-none">
            {[
              { name: 'Donor 1', amount: '₹1,00,000', border: 'border-yellow-400', delay: '' },
              { name: 'Donor 2', amount: '₹75,000', border: 'border-gray-200', delay: 'mt-4' },
              { name: 'Donor 3', amount: '₹50,000', border: 'border-amber-500', delay: 'mt-8' },
            ].map((d) => (
              <div key={d.name} className={`bg-white p-3 rounded-xl shadow text-center border-t-4 ${d.border} ${d.delay}`}>
                <div className="w-10 h-10 bg-indigo-100 rounded-full mx-auto mb-2 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {d.name[0]}
                </div>
                <p className="font-bold text-xs text-gray-800">{d.name}</p>
                <p className="text-xs text-gray-500">{d.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
