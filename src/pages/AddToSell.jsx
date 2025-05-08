import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

const AddToSell = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const filteredModels = querySnapshot.docs
          .filter((doc) => doc.data().addSell === false)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setModels(filteredModels);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleInputChange = (modelId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        [field]: value,
      },
    }));
  };

  const handleAddToSell = async (modelId) => {
    if (!formData[modelId]?.price || !formData[modelId]?.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "sells"), {
        ...formData[modelId],
        modelId,
        timestamp: new Date(),
      });

      await updateDoc(doc(db, "models", modelId), {
        addSell: true,
      });

      setModels((prev) => prev.filter((model) => model.id !== modelId));
      toast.success("Item added to sell successfully!");
    } catch (err) {
      toast.error("Error adding item to sell");
      console.error(err);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className=" mx-auto p-6 mt-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Furniture Add to Sell
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
          ) : models.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-xl mb-4">
                No items available to add
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <img
                        src={model.previewURL}
                        alt={model.name}
                        className="w-full h-48 object-contain rounded-lg"
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                      {model.name}
                    </h3>

                    <h3 className="text-xl font-semibold bg-slate-300 w-max px-3 rounded-full text-gray-500 mb-2 truncate">
                      {model.type}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={formData[model.id]?.description || ""}
                          onChange={(e) =>
                            handleInputChange(
                              model.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md "
                          rows="3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          value={formData[model.id]?.price || ""}
                          onChange={(e) =>
                            handleInputChange(model.id, "price", e.target.value)
                          }
                          className="w-full p-2 rounded-md border"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Name
                        </label>
                        <input
                          type="text"
                          value={formData[model.id]?.seller || ""}
                          onChange={(e) =>
                            handleInputChange(
                              model.id,
                              "seller",
                              e.target.value
                            )
                          }
                          className="w-full p-2 rounded-md border"
                        />
                      </div>

                      <button
                        onClick={() => handleAddToSell(model.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        Add to Sell
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddToSell;
