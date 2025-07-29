import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-b from-gray-100 to-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Create amazing <span className='text-purple-900'>content</span> 
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Use our AI tools to generate images, remove backgrounds, and more.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/ai')}
            className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
          >
            Start creating now
          </button>
          <button
            className="border border-purple-800 text-purple-800 hover:bg-purple-100 px-6 py-3 rounded-lg text-sm font-medium transition"
          >
            Watch demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
``
