import { useDropzone } from "react-dropzone";
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link, NavLink, useNavigate } from "react-router-dom";

const CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = import.meta.env.VITE_APP_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_APP_CLOUDINARY_API_SECRET;

const AddModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState("chair");
  const [previewImage, setPreviewImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    if (!modelName || !modelType || !previewImage) {
      alert("Please fill all fields and upload a preview image.");
      return;
    }

    try {
      setLoading(true);
      const modelFile = acceptedFiles[0];

      // Upload model to Cloudinary
      const modelForm = new FormData();
      modelForm.append("file", modelFile);
      modelForm.append("upload_preset", UPLOAD_PRESET);

      const modelRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        { method: "POST", body: modelForm }
      );
      const modelData = await modelRes.json();

      // Upload preview image
      const imageForm = new FormData();
      imageForm.append("file", previewImage);
      imageForm.append("upload_preset", "tutorial");

      const imageRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: "POST", body: imageForm }
      );
      const imageData = await imageRes.json();

      // Save metadata to Firebase
      await addDoc(collection(db, "models"), {
        name: modelName,
        type: modelType,
        modelURL: modelData.url,
        previewURL: imageData.secure_url,
        addSell: false,
        uploadedAt: new Date(),
      });

      setModelName("");
      setModelType("chair");
      setPreviewImage(null);
      navigate("/library");
      window.location.reload();
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
        <div className="mx-auto p-6 mt-12 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h1 className="text-3xl text-gray-900 mb-10 text-center">
            Upload Furniture
          </h1>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Model Name
              </label>
              <input
                type="text"
                placeholder="Enter model name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Model Type
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NzY3NzgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-no-repeat bg-[right:1rem_center]"
              >
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="cupboard">Cupboard</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Thumbnail
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPreviewImage(e.target.files[0])}
                  className="w-full p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors border-2 border-gray-200 rounded-lg outline-none"
                />
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div
            {...getRootProps()}
            className={`group mb-8 p-8 border-4 border-dashed rounded-2xl transition-all duration-300
      ${
        isDragActive
          ? "border-blue-500 bg-blue-50 scale-[1.01] shadow-md"
          : "border-gray-200 hover:border-blue-400 bg-gray-50"
      }
      ${loading ? "opacity-70 cursor-progress" : "cursor-pointer"}`}
          >
            <input {...getInputProps()} />
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {loading ? (
                  <div className="relative">
                    <svg
                      className="animate-spin h-14 w-14 text-blue-500"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-blue-600">
                      {progress}%
                    </span>
                  </div>
                ) : (
                  <div className="p-6 bg-white rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                    <svg
                      className="w-14 h-14 text-gray-500 group-hover:text-blue-500 transition-colors"
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
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-700">
                  {loading ? (
                    <>Processing your model...</>
                  ) : isDragActive ? (
                    <span className="text-blue-600">Drop to upload!</span>
                  ) : (
                    <>
                      <span className="text-blue-600">Browse files</span> or
                      drag and drop
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    .obj
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddModels;
