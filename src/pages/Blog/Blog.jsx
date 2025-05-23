import {
  Search,
  Menu,
  X,
  ArrowRight,
  Calendar,
  User,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2,
  BookOpen,
  Clock,
} from "lucide-react";

import { useState, useEffect } from "react";

export default function YogaBlogPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((post) => ({
          id: post._id,
          title: post.title,
          excerpt:
            post.content.length > 150
              ? post.content.slice(0, 150) + "..."
              : post.content,
          content: post.content,
          date: new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          author: "Admin",
          image: post.image,
          likes: Math.floor(Math.random() * 100),
          views: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 20),
          readTime:
            Math.ceil(post.content.split(" ").length / 200) + " min read",
        }));
        setBlogPosts(formatted);
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
      });
  }, []);

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowDetailPage(true);
  };

  const handleBackToList = () => {
    setShowDetailPage(false);
    setSelectedPost(null);
  };

  // Blog Detail Page Component
  if (showDetailPage && selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 font-sans relative overflow-hidden">
        {/* Large Bubble Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full bg-purple-400 opacity-20 -top-20 -left-20"></div>
          <div className="absolute w-80 h-80 rounded-full bg-purple-300 opacity-25 top-1/4 right-0 transform translate-x-1/3"></div>
          <div className="absolute w-64 h-64 rounded-full bg-purple-400 opacity-30 bottom-1/3 left-1/4"></div>
          <div className="absolute w-72 h-72 rounded-full bg-purple-300 opacity-20 bottom-0 right-1/4 transform translate-y-1/3"></div>
        </div>

        {/* Article Content */}
        <div className="relative z-10 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg mb-8">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center text-white text-sm mb-4">
                    <Calendar size={16} className="mr-2" />
                    <span>{selectedPost.date}</span>
                    <span className="mx-3">•</span>
                    <User size={16} className="mr-2" />
                    <span>{selectedPost.author}</span>
                    <span className="mx-3">•</span>
                    <Clock size={16} className="mr-2" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {selectedPost.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-purple-200">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-purple-600">
                    <Heart size={20} className="mr-2" />
                    <span>{selectedPost.likes}</span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <Eye size={20} className="mr-2" />
                    <span>{selectedPost.views}</span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <MessageCircle size={20} className="mr-2" />
                    <span>{selectedPost.comments}</span>
                  </div>
                </div>
                <button className="flex items-center text-purple-600 hover:text-purple-800">
                  <Share2 size={20} className="mr-2" />
                  Share
                </button>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-purple-200">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Yoga
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Wellness
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Mindfulness
                  </span>
                </div>
              </div>

              {/* Related Articles */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-purple-900 mb-6">
                  Related Articles
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {blogPosts
                    .filter((post) => post.id !== selectedPost.id)
                    .slice(0, 2)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors cursor-pointer"
                        onClick={() => handleReadMore(post)}
                      >
                        <div className="flex">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <h4 className="font-semibold text-purple-900 mb-2">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {post.excerpt.slice(0, 80)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Blog List Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 font-sans relative overflow-hidden">
      {/* Large Bubble Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-purple-400 opacity-20 -top-20 -left-20"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-300 opacity-25 top-1/4 right-0 transform translate-x-1/3"></div>
        <div className="absolute w-64 h-64 rounded-full bg-purple-400 opacity-30 bottom-1/3 left-1/4"></div>
        <div className="absolute w-72 h-72 rounded-full bg-purple-300 opacity-20 bottom-0 right-1/4 transform translate-y-1/3"></div>
        <div className="absolute w-52 h-52 rounded-full bg-purple-200 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-44 h-44 rounded-full bg-purple-400 opacity-20 top-20 right-1/3"></div>
        <div className="absolute w-36 h-36 rounded-full bg-purple-300 opacity-30 bottom-1/4 right-10"></div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Yoga Wisdom & Insights
            </h1>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {blogPosts.length === 0 ? (
          <div className="text-center text-white">Loading articles...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => handleReadMore(post)}
              >
                {/* Background Image */}
                <div className="relative h-80">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-medium text-white bg-purple-600 bg-opacity-80 backdrop-blur-sm rounded-full">
                      Yoga
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-200 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          <span>{post.views}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-white group-hover:text-purple-300 transition-colors">
                        <span className="text-sm font-medium mr-1">
                          Read More
                        </span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
