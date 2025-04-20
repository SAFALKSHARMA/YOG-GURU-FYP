import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminShopList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [openActionMenu, setOpenActionMenu] = useState(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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

  const handleEdit = (itemId) => {
    console.log("Edit item:", itemId);
    setOpenActionMenu(null);
    // Implement your edit functionality here (e.g. redirect to edit page)
  };

  const handleDelete = (itemId) => {
    console.log("Delete item:", itemId);
    setDeleteConfirmId(null);
    setOpenActionMenu(null);
    // Implement your delete functionality here
    // You would typically make an API call to delete the item
    // And then refresh the items list
  };

  const handleView = (itemId) => {
    console.log("View item:", itemId);
    setOpenActionMenu(null);
    // Implement your view functionality here (e.g. redirect to item detail page)
  };

  const handleRefresh = () => {
    setLoading(true);
    // Re-fetch the items
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
  };

  const toggleActionMenu = (e, itemId) => {
    e.stopPropagation();
    setOpenActionMenu(openActionMenu === itemId ? null : itemId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-blue-200"></div>
          <p className="text-lg text-gray-700">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <X className="mx-auto text-red-500 mb-4" size={32} />
          <p className="text-lg text-gray-700 mb-2">Unable to load items</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-purple-600">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5 7.27783H4.85714V5.8612C4.85714 5.19273 5.07332 4.55165 5.45842 4.08047C5.84351 3.60928 6.362 3.34619 6.9 3.34619H18.457C19.0034 3.34619 19.5294 3.6142 19.9195 4.09113C20.3096 4.56805 20.5262 5.21576 20.5 5.8612V7.27783Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 7.27783H23V18.9731C23 19.6416 22.7654 20.2827 22.3486 20.7539C21.9317 21.2251 21.3558 21.4881 20.7559 21.4881H4.24414C3.64418 21.4881 3.06826 21.2251 2.65141 20.7539C2.23457 20.2827 2 19.6416 2 18.9731V7.27783Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.7998 13.9644V14.8312"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Shop Inventory
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                >
                  <SlidersHorizontal size={16} className="text-gray-500" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                >
                  <RefreshCw size={16} className="text-gray-500" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">
                    Product
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">
                    Price
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">
                    Stock
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <Filter
                        className="mx-auto text-gray-400 mb-4"
                        size={32}
                      />
                      <p className="text-lg text-gray-700">No products found</p>
                      <p className="text-gray-500 mt-1">
                        Try adjusting your filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={item.images?.[0] || `/api/placeholder/64/64`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">
                          $
                          {item.price?.toFixed(2) ||
                            (Math.random() * 100 + 10).toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">
                          {item.stock ||
                            item.quantity ||
                            Math.floor(Math.random() * 100)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="relative">
                          <button
                            onClick={(e) =>
                              toggleActionMenu(e, item._id || index)
                            }
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openActionMenu === (item._id || index) && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => handleView(item._id || index)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Eye size={16} />
                                  <span>View Details</span>
                                </button>
                                <button
                                  onClick={() => handleEdit(item._id || index)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit size={16} />
                                  <span>Edit Product</span>
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmId(item._id || index)
                                  }
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Trash2 size={16} />
                                  <span>Delete Product</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirmId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
