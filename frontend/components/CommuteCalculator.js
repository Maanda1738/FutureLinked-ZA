import { useState } from 'react';
import { MapPin, Navigation, Clock, DollarSign, Car, Train, Bus, Bike } from 'lucide-react';

export default function CommuteCalculator({ jobLocation }) {
  const [userLocation, setUserLocation] = useState('');
  const [travelMode, setTravelMode] = useState('car');
  const [commuteData, setCommuteData] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateCommute = async () => {
    if (!userLocation || !jobLocation) return;

    setLoading(true);
    
    // Simulated commute calculation (in production, use Google Maps Distance Matrix API)
    setTimeout(() => {
      const distance = Math.floor(Math.random() * 50) + 5; // 5-55 km
      const timeMinutes = Math.floor(distance * (travelMode === 'car' ? 2 : travelMode === 'public' ? 3 : 4));
      const costPerKm = travelMode === 'car' ? 3.5 : travelMode === 'public' ? 1.5 : 0;
      const dailyCost = (distance * 2 * costPerKm).toFixed(2);
      const monthlyCost = (dailyCost * 22).toFixed(2);

      setCommuteData({
        distance,
        time: timeMinutes,
        dailyCost,
        monthlyCost,
        mode: travelMode
      });
      setLoading(false);
    }, 1000);
  };

  const modeIcons = {
    car: <Car className="h-5 w-5" />,
    public: <Bus className="h-5 w-5" />,
    bike: <Bike className="h-5 w-5" />
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Commute Calculator
        </h3>
      </div>

      <div className="space-y-4">
        {/* User Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Location
          </label>
          <input
            type="text"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            placeholder="Enter your address or suburb"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Job Location Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Location
          </label>
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200">
            {jobLocation || 'Not specified'}
          </div>
        </div>

        {/* Travel Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Travel Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTravelMode('car')}
              className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                travelMode === 'car'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Car className="h-5 w-5" />
              <span className="text-xs font-medium">Car</span>
            </button>
            <button
              onClick={() => setTravelMode('public')}
              className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                travelMode === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Bus className="h-5 w-5" />
              <span className="text-xs font-medium">Public</span>
            </button>
            <button
              onClick={() => setTravelMode('bike')}
              className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                travelMode === 'bike'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Bike className="h-5 w-5" />
              <span className="text-xs font-medium">Bike</span>
            </button>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateCommute}
          disabled={!userLocation || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-all"
        >
          {loading ? 'Calculating...' : 'Calculate Commute'}
        </button>

        {/* Results */}
        {commuteData && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                  <div className="text-xl font-bold">{commuteData.distance} km</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Travel Time</div>
                  <div className="text-xl font-bold">{commuteData.time} min</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</div>
                  <div className="flex justify-between">
                    <span className="font-bold">Daily: R{commuteData.dailyCost}</span>
                    <span className="font-bold text-blue-600">Monthly: R{commuteData.monthlyCost}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
