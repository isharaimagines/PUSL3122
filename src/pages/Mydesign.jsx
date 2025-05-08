import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { toast } from "react-toastify";

const Mydesign = () => {
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current_user, setCurrentUser] = useState(
    localStorage.getItem("current_user")
  );

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const q = query(
          collection(db, "designs"),
          where("user", "==", current_user)
        );
        const querySnapshot = await getDocs(q);
        const designsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDesigns(designsData);
      } catch (err) {
        setError("Failed to fetch designs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const handleDelete = async (doc_id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    try {
      await deleteDoc(doc(db, "designs", doc_id));
      toast.success("Design deleted successfully.");
      window.location.reload();
    } catch (err) {
      setError("Failed to delete the design.");
      console.error("Error deleting document:", err);
    }
  };

  if (error) {
    toast.info(error);
    return;
  }

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-16">
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={() => navigate("/design2d")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 11.0001L11 2.0005L13 2.00049L13 11.0001L22.0001 10.9999L22.0002 12.9999L13 13.0001L13.0001 22L11.0001 22L11.0001 13.0001L2.00004 13.0003L2 11.0003L11 11.0001Z"></path>
              </svg>
              Create New
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Design Projects
            </h2>
            <button className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200">
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

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:flex bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-4/12">Design Name</div>
              <div className="w-3/12">Last Modified</div>
              <div className="w-[30%]">Status</div>
              <div className="w-[8%]">Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="flex flex-col md:flex-row items-start md:items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
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
                          {design.projectName || "Untitled Project"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Project ID: #{design.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-3/12 mb-2 md:mb-0">
                    <div className="text-sm text-gray-900">
                      {new Date(
                        design.createdAt?.seconds * 1000
                      ).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{`${Math.floor(
                      (Date.now() - design.createdAt?.seconds * 1000) /
                        (1000 * 60 * 60 * 24)
                    )} days ago`}</div>{" "}
                  </div>

                  <div className="w-full md:w-3/12 mb-2 md:mb-0">
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        design.published
                          ? "bg-green-200 text-green-900"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {design.published ? "Published" : "Save"}
                    </span>
                  </div>

                  <div className="w-full flex items-start justify-between md:w-2/12">
                    <button className="flex items-center text-indigo-600 hover:text-indigo-900 px-2">
                      <i className="ri-pencil-line text-2xl mr-1"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(design.id)}
                      className="flex items-center text-red-600 hover:text-red-900"
                    >
                      <i className="ri-delete-bin-7-fill text-2xl mr-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mydesign;
