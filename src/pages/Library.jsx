import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const modelsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          uploadAt:
            doc.data().uploadAt?.toDate()?.toLocaleDateString() || "No date",
        }));
        setModels(modelsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="mx-auto p-6 mt-12">
          <div className="flex w-full items-center justify-between py-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Furniture Library
            </h1>

            <div className="text-center">
              <button
                onClick={() => navigate("/addmodels")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload New Furniture
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-64 bg-gray-100 relative overflow-hidden">
                    <img
                      src={model.previewURL}
                      alt={model.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 backdrop-blur-sm">
                      {model.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                      {model.name}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        Uploaded:{" "}
                        {model.uploadedAt?.toDate().toLocaleDateString() ||
                          "Unknown"}
                      </span>
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                        View Model
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 rounded-xl pointer-events-none" />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && models.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-xl mb-4">
                No models found in the library
              </div>
              <button
                onClick={() => navigate("/addmodels")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload First Model
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Library;
