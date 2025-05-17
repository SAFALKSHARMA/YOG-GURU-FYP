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
  Loader2,
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
      <section className="max-w-6xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Loading Your Orders
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your order history...
          </p>
        </div>
      </section>
    );
  }

  if (error === "Please login to view your order history") {
    return (
      <section className="max-w-6xl mx-auto py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto border border-gray-100">
          <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full inline-flex mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to View Orders
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to view your order history and track your purchases.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-medium"
          >
            Sign In
          </button>
          <Link
            to="/shop"
            className="block mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Continue shopping instead
          </Link>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto py-12">
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="p-4 bg-red-50 rounded-full inline-flex mx-auto mb-6">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Orders
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setLoading(true);
                window.location.reload();
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
            <Link to="/shop">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
                Continue Shopping
                <ChevronLeft className="h-5 w-5 transform rotate-180" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
            <p className="text-sm text-gray-500">
              View and manage your past purchases of yoga accessories
            </p>
          </div>
        </div>

        <Link to="/shop">
          <button className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
            <ChevronLeft className="h-5 w-5" />
            Continue Shopping
          </button>
        </Link>
      </div>

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
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="p-4 bg-indigo-50 rounded-full inline-flex mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't made any purchases yet. Explore our collection of
              premium yoga accessories and start your wellness journey today!
            </p>
            <Link to="/shop">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm">
                Browse Our Shop
                <ChevronLeft className="h-5 w-5 transform rotate-180 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="p-4 bg-gray-50 rounded-full inline-flex mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Matching Orders</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find any orders matching your search criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                {/* Order header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <span className="text-indigo-600">
                          Order #{order._id.slice(-6)}
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.paymentDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        Total: ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="divide-y divide-gray-100">
                  {order.cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-5 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 flex-shrink-0">
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
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
                      <div className="mt-4 flex justify-end"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 5 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex shadow-sm rounded-lg overflow-hidden">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-50 transition-all">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-600">
              1
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
              2
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 transition-all">
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderHistory;
