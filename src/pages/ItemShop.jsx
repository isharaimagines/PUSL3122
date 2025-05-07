import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";

const ItemShop = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // First get all sell items
        const sellsSnapshot = await getDocs(collection(db, "sells"));
        const sellsData = sellsSnapshot.docs.map((doc) => ({
          sellId: doc.id,
          ...doc.data(),
        }));

        // Get all related models
        const modelIds = sellsData.map((sell) => sell.modelId);
        const modelsQuery = query(
          collection(db, "models"),
          where(documentId(), "in", modelIds)
        );

        const modelsSnapshot = await getDocs(modelsQuery);
        const modelsData = modelsSnapshot.docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.id]: doc.data(),
          }),
          {}
        );

        // Combine data
        const combinedItems = sellsData.map((sell) => ({
          ...sell,
          ...modelsData[sell.modelId],
        }));

        setItems(combinedItems);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="max-w-7xl mx-auto p-6 mt-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Furniture Marketplace
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-xl mb-4">
                No items available in the shop
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.sellId}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={item.previewURL}
                      alt={item.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 backdrop-blur-sm">
                      {item.type}
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ${item.price}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span className="block">
                          Seller: {item.seller || "Anonymous"}
                        </span>
                        <span className="block">
                          Posted:{" "}
                          {new Date(
                            item.timestamp?.toDate()
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        Buy
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

export default ItemShop;
