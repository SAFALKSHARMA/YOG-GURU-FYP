import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Calendar,
  ChevronLeft,
  Package,
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const OrderHistory = ({ setActiveTab }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (userData === undefined) {
          console.log("User data is still loading...");
          return;
        }

        if (!userData?.userId) {
          console.log("No userId found, user is not logged in");
          setError("Please login to view your order history");
          setLoading(false);
          return;
        }

        console.log("Fetching orders for userId:", userData.userId);
        const response = await axios.get(
          `http://localhost:3000/api/payments/orders/${userData.userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          // Sort orders by date (newest first)
          const sortedOrders = response.data.orders.sort(
            (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
          );
          setOrders(sortedOrders);
          setError(null);
        } else {
          setError(response.data.message || "Failed to load order history");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Error fetching order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    document.title = "Order History | YOG-GURU";
  }, [userData, setActiveTab]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cartItems.some((item) =>
        item.productId.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedStatus === "all") return matchesSearch;
    // Add more status filters if your orders have status field
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <RefreshCw className="h-12 w-12 text-purple-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Loading your orders
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your order history...
          </p>
        </div>
      </div>
    );
  }

  if (error === "Please login to view your order history") {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-lg mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to view orders
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to view your order history and track your purchases.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
          >
            Sign In
          </button>
          <Link
            to="/shop"
            className="block mt-4 text-purple-600 hover:text-purple-800"
          >
            Continue shopping instead
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load orders
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setLoading(true);
                window.location.reload();
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
            <Link to="/shop">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center gap-2">
                Continue Shopping
                <ChevronLeft className="h-5 w-5 transform rotate-180" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              Order History
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your past purchases of yoga accessories.
            </p>
          </div>
          <Link to="/shop" className="mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition duration-300">
              <ChevronLeft className="h-5 w-5" />
              Continue Shopping
            </button>
          </Link>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-blue-400 rounded-full"></div>
      </div>

      {/* Search and filters */}
      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or product name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                {/* Add more status options if you have them */}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Order count */}
      {orders.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      )}

      {/* No orders state */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any purchases yet. Explore our collection of
              premium yoga accessories and start your wellness journey today!
            </p>
            <Link to="/shop">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2">
                Browse Our Shop
                <ChevronLeft className="h-5 w-5 transform rotate-180" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No matching orders</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find any orders matching your search criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="text-purple-600 hover:text-purple-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-300"
              >
                {/* Order header */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-lg flex items-center gap-2">
                        <span className="text-purple-600">
                          Order #{order._id.slice(-6)}
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.paymentDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        Total: ${order.totalPrice.toFixed(2)}
                      </span>

                      {/* <button className="text-gray-500 hover:text-purple-600 flex items-center gap-1 text-sm">
                        View Details <ExternalLink className="h-4 w-4" />
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="divide-y divide-gray-100">
                  {order.cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-4 hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 flex-shrink-0">
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-grow flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1 text-gray-900">
                              {item.productId.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                              <p>Category: {item.productId.category}</p>
                              {item.productId.color && (
                                <p>Color: {item.productId.color}</p>
                              )}
                              <p>Material: {item.productId.material}</p>
                              <p>Brand: {item.productId.brand}</p>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 mt-2 sm:mt-0">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                              Qty: {item.quantity}
                            </span>
                            <p className="font-semibold text-lg">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          to={`/shop/product/${item.productId._id}`}
                          className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                          Buy Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination could be added here */}
      {filteredOrders.length > 5 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex shadow-sm rounded-md">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600">
              1
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
