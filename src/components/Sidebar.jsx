import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import { House, Pen, Hash, Image, Search, Eraser, FileText, Users } from 'lucide-react';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: Pen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Search },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Eraser },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

function Sidebar({ sidebar, setSidebar }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-50 transform transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex flex-col items-center space-y-4 mb-6">
        <img src={user?.imageUrl} alt="User" className="w-16 h-16 rounded-full" />
        <h1 className="text-lg font-semibold">{user?.fullName}</h1>
        <button onClick={openUserProfile} className="text-sm text-purple-400 hover:underline">Profile</button>
        <button onClick={() => signOut()} className="text-sm text-red-400 hover:underline">Sign out</button>
      </div>
      <div className="flex flex-col space-y-4">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/ai'}
            onClick={() => setSidebar(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded hover:bg-purple-600 ${isActive ? 'bg-purple-700' : ''}`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
