import React from "react";
import { Star } from "lucide-react";

function InstructorReviews() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">
          Student Reviews
        </h2>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-5xl font-bold text-purple-900">4.9</div>
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
              </div>
              <p className="text-gray-500 text-sm">Based on 127 reviews</p>
            </div>
          </div>
          <button className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-all duration-300">
            Write a Review
          </button>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-6 last:border-0"
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-bold">
                    {["JD", "ML", "AK"][i - 1]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {["Jane Doe", "Mike Lee", "Anna Kim"][i - 1]}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {["2 weeks ago", "1 month ago", "3 months ago"][i - 1]}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                {
                  [
                    "Amazing instructor! I've taken several classes and each one has been fantastic. The instructor is knowledgeable, supportive, and creates a welcoming environment.",
                    "The classes are well-structured and the instructor really knows how to adapt to different skill levels. I've learned so much in just a few sessions.",
                    "Highly recommend! The instructor brings such positive energy to every class. I've seen significant improvement in my practice since joining.",
                  ][i - 1]
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorReviews;
