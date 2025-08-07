import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import axios from 'axios'; // Make sure axios is installed

function Community() {
  const [creations, setCreations] = React.useState([]);
  const { user } = useUser();
  const [loading, setLoading] = React.useState(true);
  const { getToken } = useAuth();

  // You should replace this with your actual toast implementation
  // For example, if using react-hot-toast: import toast from 'react-hot-toast';
  const toast = {
    success: (msg) => console.log('Success:', msg),
    error: (msg) => console.log('Error:', msg)
  };

  const fetchCreations = async () => {
    try {
      const token = await getToken();
      
      // Replace with your actual API endpoint
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || 'Failed to fetch creations');
      }
    } catch (error) {
      console.error('Error fetching creations:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch creations');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id) => {
    if (!user?.id) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      const token = await getToken();
      
      // Make the actual API call to your backend
      const { data } = await axios.post(
        '/api/user/toggle-like-creations', // Make sure this matches your backend route
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        
        // Update local state with the returned creation data
        setCreations(prev => prev.map(creation => {
          if (creation.id === id) {
            return {
              ...creation,
              likes: data.creation.likes
            };
          }
          return creation;
        }));
      } else {
        toast.error(data.message || 'Failed to toggle like');
      }

    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle like');
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-purple-600">Community Creations</h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-500 mt-2">Loading creations...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creations.map((creation) => (
              <div
                key={creation.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-100 transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <img
                  src={creation.content}
                  alt={creation.prompt}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x224?text=Image+Not+Found';
                  }}
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {creation.prompt}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Heart
                      onClick={() => toggleLike(creation.id)}
                      className={`w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-110 ${
                        creation.likes?.includes(user?.id?.toString())
                          ? 'fill-red-500 text-red-600 drop-shadow-sm'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    />
                    <span className="select-none">
                      {creation.likes?.length || 0}{' '}
                      {(creation.likes?.length || 0) === 1 ? 'like' : 'likes'}
                    </span>
                  </div>

                  {creation.description && (
                    <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                      {creation.description}
                    </p>
                  )}

                  {creation.created_at && (
                    <p className="text-xs text-gray-400">
                      {new Date(creation.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!creations.length && (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No creations yet</h3>
              <p className="text-gray-500">
                Be the first to share your amazing creation with the community!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Community;