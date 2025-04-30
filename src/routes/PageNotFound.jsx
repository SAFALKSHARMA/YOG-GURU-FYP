import { useState, useEffect } from "react";
import { Flower, ArrowRight, Home, Compass } from "lucide-react";

export default function PageNotFound() {
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    // Start breathing animation after component mounts
    setIsBreathing(true);

    // Reset animation every 5 seconds
    const interval = setInterval(() => {
      setIsBreathing(false);
      setTimeout(() => setIsBreathing(true), 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg bg-white rounded-lg shadow-xl p-8 md:p-12">
        {/* Animated flower icon */}
        <div
          className={`mx-auto text-center mb-6 transition-all duration-500 ease-in-out ${
            isBreathing ? "scale-110" : "scale-100"
          }`}
        >
          <Flower
            size={72}
            className="text-purple-600 mx-auto"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Find Your Center
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-purple-700 mb-6">
          Page Not Found
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          The pose you're looking for seems to have moved or no longer exists.
          Take a deep breath and let's find your way back to balance.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <a
            href="/"
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            <Home size={20} />
            <span>Return Home</span>
          </a>

          <a
            href="/classes"
            className="flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            <Compass size={20} />
            <span>Explore Classes</span>
          </a>
        </div>

        <div className="text-gray-500 italic border-t border-gray-200 pt-6">
          "In the midst of movement and chaos, keep stillness inside of you." —
          Deepak Chopra
        </div>
      </div>

      <div className="mt-8 text-gray-500 flex items-center">
        <span>Ready to continue your journey?</span>
        <ArrowRight size={16} className="ml-2" />
      </div>
    </div>
  );
}
