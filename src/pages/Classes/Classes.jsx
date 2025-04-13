import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassCard from "../../ui/ClassCard";
import FavouriteIcon from "../../ui/FavouriteIcon";
import { Search, Filter, X } from "lucide-react";

const Classes = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [durationRange, setDurationRange] = useState([0, 120]);
  const userId = "user-id-here"; // Replace with actual userId

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/classes/all-classes"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        setAllClasses(data);

        // Filter classes where capacity > 0
        const availableClasses = data.filter((cls) => cls && cls.capacity > 0);
        setFilteredClasses(availableClasses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const toggleFavorite = (yogaClass) => {
    setFavorites((prev) => ({
      ...prev,
      [yogaClass._id]: !prev[yogaClass._id],
    }));
  };

  // Apply filters and sorting to the available classes with null checks
  const finalFilteredClasses = filteredClasses
    .filter((yogaClass) => {
      // Make sure yogaClass and its properties exist
      if (!yogaClass) return false;

      // Safe toLowerCase() with optional chaining and nullish coalescing
      const className = (yogaClass.name || "").toLowerCase();
      const classLevel = yogaClass.level || "";
      const classDuration = yogaClass.duration || 0;

      return (
        className.includes(searchQuery.toLowerCase()) &&
        (selectedLevel === "all" || classLevel === selectedLevel) &&
        classDuration >= durationRange[0] &&
        classDuration <= durationRange[1]
      );
    })
    .sort((a, b) => {
      if (sortBy === "duration-low")
        return (a.duration || 0) - (b.duration || 0);
      if (sortBy === "duration-high")
        return (b.duration || 0) - (a.duration || 0);
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "capacity") return (b.capacity || 0) - (a.capacity || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-purple-200"></div>
          <p className="text-lg text-white">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <X className="mx-auto text-red-300 mb-4" size={32} />
          <p className="text-lg text-white mb-2">Unable to load classes</p>
          <p className="text-purple-200 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div
        className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-500/20 rounded-full translate-x-1/3 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full translate-y-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-full h-full bg-purple-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Yoga Classes</h1>
          <p className="text-purple-200">
            Find the perfect class for your practice
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white placeholder-purple-300 backdrop-blur-sm transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-12 px-4 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="duration-low">Duration: Short to Long</option>
              <option value="duration-high">Duration: Long to Short</option>
              <option value="capacity">Available Spots</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 flex items-center gap-2 border-2 border-white/10 hover:border-white/20 rounded-xl bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 border-2 border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-purple-200 mb-2">
                  Duration (minutes)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={durationRange[0]}
                    onChange={(e) =>
                      setDurationRange([
                        Number(e.target.value),
                        durationRange[1],
                      ])
                    }
                    className="w-full h-10 px-3 rounded-lg border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white"
                    placeholder="Min"
                  />
                  <span className="text-purple-200">-</span>
                  <input
                    type="number"
                    value={durationRange[1]}
                    onChange={(e) =>
                      setDurationRange([
                        durationRange[0],
                        Number(e.target.value),
                      ])
                    }
                    className="w-full h-10 px-3 rounded-lg border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {finalFilteredClasses.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10">
            <Filter className="mx-auto text-purple-300 mb-4" size={32} />
            <p className="text-lg text-white">No classes found</p>
            <p className="text-purple-200 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              Available Classes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {finalFilteredClasses.map((yogaClass) => (
                <ClassCard
                  key={yogaClass._id || Math.random().toString()}
                  yogaClass={yogaClass}
                  isFavorite={favorites[yogaClass._id]}
                  toggleFavorite={toggleFavorite}
                  userId={userId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Classes;
