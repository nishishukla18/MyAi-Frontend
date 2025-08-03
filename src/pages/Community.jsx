import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import dummyPublishedCreationsData from '../data/PublishedCreations';

function Community() {
  const [creations, setCreations] = React.useState([]);
  const { user } = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationsData);
  };

  React.useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-primary">Community Creations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-100 transition-transform hover:scale-[1.02]"
          >
            <img src={creation.content} alt={creation.prompt} className="w-full h-56 object-cover" />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{creation.prompt}</h2>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-gray-400'
                  }`}
                />
                <span>{creation.likes.length} {creation.likes.length === 1 ? 'like' : 'likes'}</span>
              </div>

              <p className="text-gray-700 text-sm">{creation.description}</p>
            </div>
          </div>
        ))}
      </div>

      {!creations.length && (
        <p className="text-center text-gray-500 mt-10">No creations available yet. Check back soon!</p>
      )}
    </div>
  );
}

export default Community;
