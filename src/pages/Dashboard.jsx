import { Sparkles, Gem } from 'lucide-react';
import React from 'react';
import { Protect } from '@clerk/clerk-react';
import CreationItems from '../components/CreationItems';
import dummyCreationData from '../data/DummyCreationData';

function Dashboard() {
  const [creations, setCreations] = React.useState([]);

  const getDashboardData = async () => {
    setCreations(dummyCreationData);
  };

  React.useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Total Creations Card */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-600">Total Creations</p>
            <h2 className="text-2xl font-bold">{creations.length}</h2>
          </div>
          <div className="text-primary">
            <Sparkles size={32} />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-600">Active Plan</p>
            <h2 className="text-2xl font-bold">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className="text-primary">
            <Gem size={32} />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Creations</h2>
        {creations.map((creation, index) => (
          <CreationItems key={index} item={creation} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
