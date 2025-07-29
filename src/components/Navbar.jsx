import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="w-full h-16 px-6 md:px-16 flex items-center justify-between bg-white shadow-md">
      
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <img
          src="/logo.png"  // Replace with your actual logo path
          alt="logo"
          className="w-28 sm:w-40"
        />
      </div>

      {/* User Button / Sign In */}
      <div>
        {user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-1 bg-purple-950 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-all"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
