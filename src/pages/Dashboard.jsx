import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (token) {
      setToken(localStorage.getItem("token"));
    } else if (role) {
      setRole(localStorage.getItem("role"));
    }
  }, [token]);
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Card 1: Total Design */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    ></path>
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Total Design
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">248</p>
              <p className="mt-2 text-sm text-gray-500">+12% from last month</p>
            </div>
          </div>

          {/* Card 2: Available Furniture Count */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Available Furniture
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">1,429</p>
              <p className="mt-2 text-sm text-gray-500">
                +8.1% from last month
              </p>
            </div>
          </div>

          {/* Card 3: User Role */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  User Role
                </h3>
              </div>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-800 capitalize">
                  {role}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                  Full Access
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Last login: 2 hours ago
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 mt-8">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Design Projects
            </h2>
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
              Filter Designs
            </button>
          </div>

          {/* Design List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:flex bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-4/12">Design Name</div>
              <div className="w-3/12">Last Modified</div>
              <div className="w-3/12">Status</div>
              <div className="w-2/12">Actions</div>
            </div>

            {/* Design Items */}
            <div className="divide-y divide-gray-200">
              {/* Design Item 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="w-full md:w-4/12 mb-2 md:mb-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-900">
                        Modern Living Room
                      </div>
                      <div className="text-sm text-gray-500">
                        Project ID: #DSGN-001
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-3/12 mb-2 md:mb-0">
                  <div className="text-sm text-gray-900">2023-08-15</div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>

                <div className="w-full md:w-3/12 mb-2 md:mb-0">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </div>

                <div className="w-full md:w-2/12">
                  <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                    Edit
                  </button>
                </div>
              </div>

              {/* Design Item 2 - Add similar structure with different status */}
              {/* Design Item 3 - Add similar structure */}

              {/* Example of different status */}
              <div className="flex flex-col md:flex-row items-start md:items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                {/* ... Similar structure as above ... */}
                <div className="w-full md:w-3/12 mb-2 md:mb-0">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    In Review
                  </span>
                </div>
                {/* ... */}
              </div>

              {/* Example of draft status */}
              <div className="flex flex-col md:flex-row items-start md:items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                {/* ... Similar structure as above ... */}
                <div className="w-full md:w-3/12 mb-2 md:mb-0">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Draft
                  </span>
                </div>
                {/* ... */}
              </div>
            </div>

            {/* Pagination/Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-center items-center">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300">
                  Load More Designs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
