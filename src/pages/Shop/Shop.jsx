import { useState, useEffect } from "react";
import { Heart, Search, Filter, SlidersHorizontal, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/shop/getAll-items"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "all" || item.category === selectedCategory) &&
        (selectedBrands.length === 0 || selectedBrands.includes(item.brand)) &&
        item.price >= priceRange[0] &&
        item.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-purple-200"></div>
          <p className="text-lg text-white">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <X className="mx-auto text-red-300 mb-4" size={32} />
          <p className="text-lg text-white mb-2">Unable to load items</p>
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
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div
        className="absolute top-1/4 right-0 w-[25rem] h-[25rem] bg-indigo-500/20 rounded-full translate-x-1/3 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-purple-400/20 rounded-full translate-y-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-[20rem] h-[20rem] bg-indigo-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-purple-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Yoga Accessories
          </h1>
          <p className="text-purple-200">Premium equipment for your practice</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white placeholder-purple-300 backdrop-blur-sm transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 px-4 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="mats">Yoga Mats</option>
              <option value="blocks">Blocks</option>
              <option value="props">Props</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 flex items-center gap-2 border-2 border-white/10 hover:border-white/20 rounded-xl bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 border-2 border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-purple-200 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full h-10 px-3 rounded-lg border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white"
                    placeholder="Min"
                  />
                  <span className="text-purple-200">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full h-10 px-3 rounded-lg border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="mx-auto text-purple-300 mb-4" size={32} />
            <p className="text-lg text-white">No items found</p>
            <p className="text-purple-200 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleViewProduct = () => {
    console.log("Viewing product:", item);
    navigate(`/shop/${item._id}`);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Default overlay with name and price */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white font-medium mb-1 line-clamp-2">
              {item.name}
            </h2>
            <p className="text-purple-200 font-semibold">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Favorite button */}
        <button
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="Add to favorites"
        >
          <Heart
            size={18}
            className={
              isFavorite ? "fill-purple-500 text-purple-500" : "text-purple-500"
            }
          />
        </button>

        {/* Sliding View Product Button */}
        <div className="absolute inset-0 flex items-center">
          <button
            onClick={handleViewProduct}
            className="flex items-center gap-2 bg-white/90 text-purple-700 py-3 px-6 rounded-r-full font-medium -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
          >
            <Eye size={18} />
            <span>View Product</span>
          </button>
        </div>
      </div>

      {/* Animated background circles */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-purple-200/20 animate-pulse"></div>
      <div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-purple-300/20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
}
