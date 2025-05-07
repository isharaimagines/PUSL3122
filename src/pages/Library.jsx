import { useDropzone } from "react-dropzone";
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import ModelPreview from "../components/ModelPreview";

const CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = import.meta.env.VITE_APP_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_APP_CLOUDINARY_API_SECRET;

const Library = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "models"));
      const modelList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setModels(modelList);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const onDrop = async (acceptedFiles) => {
    try {
      setLoading(true);
      const file = acceptedFiles[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsign_3d_upload");
      formData.append("cloud_name", CLOUD_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        { method: "POST", body: formData }
      );

      const uploadImageURL = await res.json();
      console.log(uploadImageURL.url);

      await addDoc(collection(db, "models"), {
        fileURL: uploadImageURL.url,
        name: "Model",
        uploadedAt: new Date(),
      });
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "model/gltf-binary": [".glb"],
      "model/obj": [".obj"],
      "model/stl": [".stl"],
    },
  });

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            3D Model Library
          </h1>

          {/* Upload Section */}
          <div
            {...getRootProps()}
            className={`mb-8 p-8 border-2 border-dashed rounded-xl transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {loading ? (
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
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                )}
              </div>
              <p className="text-gray-600 font-medium">
                {loading
                  ? "Uploading..."
                  : isDragActive
                  ? "Drop models here"
                  : "Drag & drop 3D models, or click to browse"}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: .glb, .obj, .stl
              </p>
            </div>
          </div>

          {/* Model Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading models...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div key={model.id} className="...">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {model.name || "Model"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Uploaded:{" "}
                      {model.uploadedAt?.toDate().toLocaleDateString()}
                    </p>
                    <div className="h-48 bg-gray-100">
                      <ModelPreview modelUrl={model.fileURL} />
                    </div>

                    <a
                      href={model.fileURL}
                      download
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && models.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No models found in your library. Upload some models to get
              started.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Library;
