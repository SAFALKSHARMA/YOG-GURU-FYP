import React from "react";
import { Mail, Phone } from "lucide-react";
import Sidebar from "./Sidebar";

const StudentsList = () => {
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 234 567 8900",
      enrolledClasses: ["Morning Vinyasa Flow", "Meditation Basics"],
      joinedDate: "2024-02-15",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@example.com",
      phone: "+1 234 567 8901",
      enrolledClasses: ["Power Yoga"],
      joinedDate: "2024-02-10",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      phone: "+1 234 567 8902",
      enrolledClasses: ["Morning Vinyasa Flow"],
      joinedDate: "2024-02-01",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 ml-8">
        {" "}
        {/* Ensure this is pushed enough to the right */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Students List</h1>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Enrolled Classes
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-700 font-medium">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <Mail size={16} className="mr-2" />
                          {student.email}
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2" />
                          {student.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.enrolledClasses.map((className, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full"
                          >
                            {className}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(student.joinedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
