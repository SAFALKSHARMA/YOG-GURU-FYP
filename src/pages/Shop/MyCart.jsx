import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Calendar,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { AppContent } from "../../context/AppContext";

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  // Fetch cart data from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // First check if userData is being loaded
        if (userData === undefined) {
          console.log("User data is still loading...");
          return;
        }

        // Then check if user is logged in
        if (!userData?.userId) {
          console.log("No userId found, user is not logged in");
          setError("Please login to view your cart");
          setLoading(false);
          return;
        }

        console.log("Fetching cart for userId:", userData.userId);
        const response = await fetch(
          `http://localhost:3000/api/shop/cart/${userData.userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();

        if (data.success) {
          setCart(data.cartItems);
          setError(null);
        } else {
          setError(data.message || "Failed to load cart items");
        }
      } catch (err) {
        setError(err.message || "Error fetching cart data");
        console.error("Error fetching cart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    document.title = "My Cart | YOG-GURU";
  }, [userData]);

  // Calculate cart totals
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + tax + shipping - discount;

  // Handle quantity changes (frontend only)
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(
      cart.map((item) =>
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/cart/${userData.userId}/items/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item");
      }

      setCart(cart.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.message || "Failed to remove item");
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "yogaguru") {
      setDiscount(subtotal * 0.1); // 10% discount
      setPromoApplied(true);
      setError(null);
    } else {
      setError("Invalid promo code");
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error && error !== "Please login to view your cart") {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/shop" className="text-purple-600 hover:text-purple-800">
          Return to shop
        </Link>
      </div>
    );
  }

  if (error === "Please login to view your cart") {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="text-purple-600 hover:text-purple-800 mt-2"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    alert("Paisa tirisake muji maile");
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8" />
        My Cart
        <span className="text-lg font-normal text-gray-500 ml-2">
          ({cart.length} {cart.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="border-b border-gray-200 pb-2 mb-6">
        <p className="text-gray-600">
          Review your items and proceed to checkout when you're ready.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any yoga classes or products yet.
          </p>
          <Link to="/shop">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2 mx-auto">
              Browse Our Shop <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">Shopping Cart</h2>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="p-6 flex flex-col md:flex-row gap-4"
                  >
                    {/* Item Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.product.name}
                      </h3>

                      {/* Product details */}
                      <p className="text-gray-600 mb-1">
                        {item.product.category}
                        {item.product.color && ` • ${item.product.color}`}
                      </p>

                      <p className="text-gray-600 mb-1">
                        Material: {item.product.material}
                      </p>

                      <p className="text-gray-600 mb-1">
                        Brand: {item.product.brand}
                      </p>

                      <p className="flex items-center gap-1 text-gray-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        Added on: {new Date(item.addedAt).toLocaleDateString()}
                      </p>

                      <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center">
                          <span className="font-semibold text-lg">
                            ${item.product.price.toFixed(2)}
                          </span>
                          <div className="ml-4 flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-gray-600 hover:text-red-600 transition flex items-center gap-1"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/shop"
                  className="text-purple-600 hover:text-purple-800 transition flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              {/* Summary Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">Order Summary</h2>
              </div>

              {/* Promo Code */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>

                {promoApplied && (
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Promo code applied successfully!
                  </div>
                )}

                {error && !promoApplied && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Try code "YOGAGURU" for 10% off
                </div>
              </div>

              {/* Price Details */}
              <div className="p-6 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="p-6">
                <button
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition duration-300"
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-5 w-5" />
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-xs text-center text-gray-500">
                  By proceeding, you agree to our Terms of Service and Privacy
                  Policy
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;
