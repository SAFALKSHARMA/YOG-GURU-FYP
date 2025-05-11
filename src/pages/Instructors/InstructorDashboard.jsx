import React, { useEffect, useState, useContext } from "react";
import {
  User,
  BookOpen,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Clock3,
  MapPin,
  ChevronRight,
  BarChart,
  PieChart,
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { AppContent } from "../../context/AppContext";
import Sidebar from "./Sidebar";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const InstructorDashboard = () => {
  const { instructorData } = useContext(AppContent);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchInstructorStats = async () => {
      try {
        if (!instructorData?._id) return;

        const response = await fetch(
          `http://localhost:3000/api/stats/${instructorData._id}`
        );
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching instructor stats:", error);
        setLoading(false);
      }
    };

    fetchInstructorStats();
  }, [instructorData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg text-gray-600">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  // Data for charts
  const bookingStatusData = {
    labels: ["Approved", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          dashboardData.recentBookings.filter((b) => b.status === "Approved")
            .length,
          dashboardData.recentBookings.filter((b) => b.status === "Pending")
            .length,
          dashboardData.recentBookings.filter((b) => b.status === "Cancelled")
            .length,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const classCapacityData = {
    labels: dashboardData.classes.map((cls) => cls.name),
    datasets: [
      {
        label: "Enrolled",
        data: dashboardData.classes.map((cls) => cls.studentCount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Capacity",
        data: dashboardData.classes.map((cls) => cls.capacity),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 mr-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center mb-3">
        <Icon className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="h-48">{children}</div>
    </div>
  );

  const Table = ({ title, icon: Icon, data, columns }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center mb-3">
        <Icon className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item._id}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(item[column.dataIndex], item)
                      : item[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "ml-19" : "ml-19"
        }`}
      >
        <div className="p-5 bg-gray-50 min-h-screen">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <img
              src={dashboardData.instructor.image}
              alt={dashboardData.instructor.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Welcome back, {dashboardData.instructor.fullName}
              </h1>
              <p className="text-gray-500 text-sm">
                Here's your teaching dashboard overview
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={BookOpen}
              title="Total Classes"
              value={dashboardData.stats.totalClasses}
              color="blue"
            />
            <StatCard
              icon={Users}
              title="Total Students"
              value={dashboardData.stats.totalStudents}
              color="green"
            />
            <StatCard
              icon={Calendar}
              title="Total Bookings"
              value={dashboardData.stats.totalBookings}
              color="purple"
            />
            <StatCard
              icon={CheckCircle}
              title="Upcoming Classes"
              value={dashboardData.stats.upcomingClasses}
              color="orange"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <ChartCard title="Booking Status" icon={PieChart}>
              <Pie
                data={bookingStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </ChartCard>

            <ChartCard title="Class Capacity" icon={BarChart}>
              <Bar
                data={classCapacityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </ChartCard>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Table
              title="Recent Bookings"
              icon={Calendar}
              data={dashboardData.recentBookings}
              columns={[
                {
                  title: "Student",
                  dataIndex: "fullName",
                  key: "name",
                },
                {
                  title: "Date & Time",
                  key: "datetime",
                  render: (_, record) => (
                    <div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                        {new Date(record.preferredDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {record.preferredTime}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : status === "Pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status}
                    </span>
                  ),
                },
              ]}
            />

            <Table
              title="Recent Students"
              icon={Users}
              data={dashboardData.recentStudents}
              columns={[
                {
                  title: "Student",
                  key: "student",
                  render: (_, record) => (
                    <div className="flex items-center">
                      <img
                        src={record.user.image}
                        alt={record.user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="font-medium">{record.user.name}</div>
                        <div className="text-xs text-gray-500">
                          {record.user.email}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Class",
                  key: "class",
                  render: (_, record) => (
                    <div>
                      <div>{record.class.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(record.class.date).toLocaleDateString()} at{" "}
                        {record.class.time}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Enrolled",
                  key: "enrolledAt",
                  render: (_, record) => (
                    <div className="text-sm text-gray-500">
                      {new Date(record.enrolledAt).toLocaleDateString()}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
