
import React from 'react';
import RealEstateForm from './components/RealEstateForm';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-red-50 rounded-bl-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-slate-100 rounded-tr-[100px] -z-10"></div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
          <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">MapleLeaf Rentals AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
          <a href="#" className="hover:text-red-600 transition-colors">Tenant Rights</a>
          <a href="#" className="hover:text-red-600 transition-colors">Rent Maps</a>
          <a href="#" className="hover:text-red-600 transition-colors">Resources</a>
        </div>
        <button className="px-6 py-2 border-2 border-slate-900 text-slate-900 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all text-sm">
          Post a Listing
        </button>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Hero Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-widest">
              Smart Rental Discovery • Canada Wide
            </div>
            <h1 className="text-5xl md:text-7xl font-display text-slate-900 leading-[1.1]">
              Find your next <span className="text-red-600">Home</span> without the stress.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Intelligent rental search across Canada. From Toronto lofts to Vancouver suites, we help you find the perfect place with AI-driven market data.
            </p>
            
            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-3xl font-display font-bold text-slate-900">20k+</p>
                <p className="text-slate-500 text-sm uppercase tracking-wider">New Rentals</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-slate-900">100%</p>
                <p className="text-slate-500 text-sm uppercase tracking-wider">Verified</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-slate-900">AI</p>
                <p className="text-slate-500 text-sm uppercase tracking-wider">Advocate</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-7">
            <RealEstateForm />
          </div>

        </div>

        {/* Featured Markets */}
        <section className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display text-slate-900">Trending Rental Markets</h2>
              <p className="text-slate-500 mt-2">Current average monthly rents across the nation.</p>
            </div>
            <button className="text-red-600 font-bold hover:underline">View all cities →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Toronto, ON', image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=400&h=300', rent: '$2,800' },
              { name: 'Montreal, QC', image: 'https://images.unsplash.com/photo-1519177224410-b047630ca78d?auto=format&fit=crop&w=400&h=300', rent: '$1,750' },
              { name: 'Halifax, NS', image: 'https://images.unsplash.com/photo-1555529322-8302062534f3?auto=format&fit=crop&w=400&h=300', rent: '$2,100' },
              { name: 'Calgary, AB', image: 'https://images.unsplash.com/photo-1563829035251-872f232467d0?auto=format&fit=crop&w=400&h=300', rent: '$1,900' }
            ].map(city => (
              <div key={city.name} className="group cursor-pointer overflow-hidden rounded-2xl relative h-64 bg-slate-200">
                <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                  <p className="text-white font-bold text-xl">{city.name}</p>
                  <p className="text-slate-300 text-sm">Avg. Rent: {city.rent}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">M</div>
            <span className="text-xl font-display font-bold">MapleLeaf Rentals AI</span>
          </div>
          <p className="text-slate-500 text-sm">Empowering Canadian renters with transparent data and rights advocacy.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Tenant Help</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Legal Board</a>
          </div>
        </div>
      </footer>

      {/* AI Chatbot FAB */}
      <Chatbot />
    </div>
  );
};

export default App;
