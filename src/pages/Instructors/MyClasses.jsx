import React, { useEffect, useState, useContext } from "react";
import { Clock, Users, Edit, Trash2 } from "lucide-react";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";

const MyClasses = () => {
  const { instructorData } = useContext(AppContent);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!instructorData || !instructorData._id) {
        toast.error("Instructor ID is missing. Please reload the page.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/classes/instructor/${instructorData._id}`
        );
        const result = await response.json();
        if (result.success) {
          setClasses(result.classes); // Assuming the response contains an array of classes
        } else {
          toast.error("Failed to load classes.");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Something went wrong! Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [instructorData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Classes</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Class Name</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Students</th>
              <th className="px-4 py-2 text-left">Capacity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length > 0 ? (
              classes.map((yogaClass) => (
                <tr key={yogaClass._id} className="border-b hover:bg-purple-50">
                  <td className="px-4 py-2">
                    {yogaClass.image && (
                      <img
                        src={yogaClass.image}
                        alt={yogaClass.name}
                        className="w-12 h-12 object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">{yogaClass.className}</td>
                  <td className="px-4 py-2">{yogaClass.time}</td>
                  <td className="px-4 py-2">{yogaClass.duration} min</td>
                  <td className="px-4 py-2">{yogaClass.students}</td>
                  <td className="px-4 py-2">{yogaClass.capacity} seats</td>
                  <td className="px-4 py-2">Rs. {yogaClass.price}</td>
                  <td className="px-4 py-2">
                    <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                      <Edit size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-2 text-center">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClasses;
