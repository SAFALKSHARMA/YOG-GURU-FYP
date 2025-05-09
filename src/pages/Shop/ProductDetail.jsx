import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { userData } = useContext(AppContent);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/shop/get-item/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userData?.userId) {
      toast.info("Please login to add items to cart", {
        autoClose: 3000,
        closeButton: true,
      });
      navigate("/login");
      return;
    }

    if (product.stock <= 0) {
      toast.error("This product is currently out of stock", {
        autoClose: 4000,
      });
      return;
    }

    if (quantity > product.stock) {
      toast.warn(`Only ${product.stock} items available in stock`, {
        autoClose: 4000,
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/shop/add-to-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.userId,
            productId: id,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to cart");
      }

      toast.success(
        `${quantity} ${quantity > 1 ? "items" : "item"} of "${
          product.name
        }" added to cart`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.message || "Failed to add item to cart", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    toast(
      newFavoriteStatus
        ? "Added to your favorites ❤️"
        : "Removed from favorites 💔",
      {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-purple-200"></div>
          <p className="text-lg text-purple-800">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-purple-800 mb-2">Unable to load product</p>
          <p className="text-purple-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-purple-800">Product not found</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to shop
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-2xl bg-white shadow-lg mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden bg-white shadow-sm ${
                    selectedImage === index
                      ? "ring-2 ring-purple-500"
                      : "hover:ring-1 hover:ring-purple-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
            </div>

            <p className="text-2xl font-semibold text-purple-600 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-gray-900 capitalize">{product.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                <p className="text-gray-900 capitalize">{product.brand}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Material</h3>
                <p className="text-gray-900 capitalize">{product.material}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Color</h3>
                <p className="text-gray-900 capitalize">{product.color}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                <p className="text-gray-900">
                  {product.stock > 0 ? (
                    <span className="text-green-600">
                      {product.stock} available
                    </span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-900">{quantity}</span>
                <button
                  onClick={() => {
                    if (quantity >= product.stock) {
                      toast.warn(`Only ${product.stock} items available`, {
                        autoClose: 3000,
                      });
                      return;
                    }
                    setQuantity(quantity + 1);
                  }}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                disabled={product.stock <= 0 || isAddingToCart}
              >
                <ShoppingBag size={20} />
                <span>{isAddingToCart ? "Adding..." : "Add to cart"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
