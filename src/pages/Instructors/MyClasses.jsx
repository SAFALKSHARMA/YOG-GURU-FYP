import React, { useState, useContext, useEffect } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Briefcase,
  Calendar,
  Clock,
  Users,
  Eye,
} from "lucide-react";
import Sidebar from "./Sidebar";
import ClassDetailsModal from "../../Admin/classModal";
import { AppContent } from "../../context/AppContext";
import Table from "../../ui/Table";
import { toast } from "react-toastify";
import ConfirmationModal from "../../ui/ConfirmationModal";

const MyClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { instructorData, setInstructorData } = useContext(AppContent);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!instructorData?._id) return;
      const endpoint = `http://localhost:3000/api/classes/instructor/${instructorData._id}`;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch classes");
        }
        const data = await response.json();
        console.log(data);

        // Corrected: Access the classes array from the response object
        setClasses(Array.isArray(data.classes) ? data.classes : []);

        // Optional: Update instructorData if needed
        if (setInstructorData) {
          setInstructorData((prev) => ({
            ...prev,
            classes: data.classes || [],
          }));
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [instructorData?._id, setInstructorData]);

  const handleViewClassDetails = (classItem) => setSelectedClass(classItem);
  const handleCloseModal = () => setSelectedClass(null);

  const handleUpdateClass = async (formData) => {
    setLoading(true);
    setError(null);
    const classId = formData.get("_id");
    try {
      if (instructorData?._id && !formData.get("instructorId")) {
        formData.append("instructorId", instructorData._id);
      }
      const response = await fetch(
        `http://localhost:3000/api/classes/${classId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update class");
      }
      const { updatedClass } = await response.json();
      setClasses((prev) =>
        prev.map((cls) => (cls._id === updatedClass._id ? updatedClass : cls))
      );
      if (setInstructorData) {
        setInstructorData((prev) => ({
          ...prev,
          classes: prev.classes.map((cls) =>
            cls._id === updatedClass._id ? updatedClass : cls
          ),
        }));
      }
      setSelectedClass(null);
      toast.success("Class updated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initiateDeleteClass = (classItem) => {
    if (!classItem?._id) return toast.error("Class ID is missing");
    setClassToDelete(classItem);
    setDeleteModalOpen(true);
  };

  const handleDeleteClass = async () => {
    if (!classToDelete?._id) return toast.error("Class ID is missing");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/classes/delete-class`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: classToDelete._id,
            instructorId: instructorData?._id,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete class");
      }
      setClasses((prev) => prev.filter((cls) => cls._id !== classToDelete._id));
      if (setInstructorData) {
        setInstructorData((prev) => ({
          ...prev,
          classes: prev.classes.filter((cls) => cls._id !== classToDelete._id),
        }));
      }
      toast.success("Class deleted successfully!");
      setSelectedClass(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setClassToDelete(null);
  };

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      typeof classItem.className === "string" &&
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || classItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "className",
      title: "Class",
      sortable: true,
      render: (item) => (
        <div className="flex items-center">
          <Briefcase size={16} className="text-purple-500 mr-2" />
          <span className="font-medium">{item.className}</span>
        </div>
      ),
    },
    {
      key: "date",
      title: "Schedule",
      sortable: true,
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center text-gray-700">
            <Calendar size={14} className="mr-2 text-gray-400" />
            {new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center text-gray-700">
            <Clock size={14} className="mr-2 text-gray-400" />
            {item.time}
          </div>
        </div>
      ),
    },
    {
      key: "capacity",
      title: "Capacity",
      sortable: true,
      render: (item) => (
        <div className="flex items-center">
          <Users size={16} className="mr-2 text-gray-400" />
          <span>{item.capacity}</span>
          <span className="text-gray-500 ml-1">seats</span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
            item.status === "Approved"
              ? "bg-green-500"
              : item.status === "Rejected"
              ? "bg-red-500"
              : "bg-amber-500"
          }`}
        >
          {item.status || "Pending"}
        </span>
      ),
    },
  ];

  const rowActions = (item) => [
    {
      label: "View Details",
      icon: <Eye size={16} className="text-blue-500" />,
      onClick: () => handleViewClassDetails(item),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:ml-8">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <BookOpen className="mr-3 text-purple-600" size={28} />
              My Classes
            </h1>
            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search my classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative flex-grow md:flex-grow-0 md:w-40">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            data={filteredClasses}
            loading={loading}
            error={error}
            emptyState={{
              icon: <BookOpen size={40} />,
              message: "No classes found matching your criteria.",
            }}
            onRowClick={handleViewClassDetails}
            rowActions={rowActions}
          />
        </div>
      </div>
      {selectedClass && (
        <ClassDetailsModal
          selectedClass={selectedClass}
          handleCloseModal={handleCloseModal}
          onSaveChanges={handleUpdateClass}
          onDeleteClass={initiateDeleteClass}
        />
      )}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteClass}
        title="Delete Class"
        message={`Are you sure you want to delete the class "${classToDelete?.className}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
      />
    </div>
  );
};

export default MyClasses;
