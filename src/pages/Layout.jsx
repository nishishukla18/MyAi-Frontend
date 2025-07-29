import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

function Layout() {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 w-full">
        {/* Top Navbar */}
        <nav className="bg-white shadow px-4 py-3 flex justify-between items-center md:hidden">
          <button onClick={() => navigate('/')} className="text-purple-600 font-semibold">Home</button>
          {sidebar ? (
            <X onClick={() => setSidebar(false)} className="w-6 h-6 cursor-pointer" />
          ) : (
            <Menu onClick={() => setSidebar(true)} className="w-6 h-6 cursor-pointer" />
          )}
        </nav>

        {/* Authenticated View */}
        {user ? (
          <div className="p-4">
            <Outlet />
          </div>
        ) : (
          // Unauthenticated View
          <div className="p-4">
            <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
              <button onClick={() => navigate('/')} className="text-purple-600 font-semibold">Home</button>
              <button
                onClick={() => openSignIn()}
                className="bg-#8067b7 text-white px-4 py-1 rounded hover:bg-#8067b7"
              >
                Sign In
              </button>
            </nav>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
