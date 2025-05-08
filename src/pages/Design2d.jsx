import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = import.meta.env.VITE_APP_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_APP_CLOUDINARY_API_SECRET;

export default function Design2d() {
  const canvasRef = useRef(null);

  const [projectName, setProjectName] = useState(
    localStorage.getItem("ProjectName")
  );
  const [current_user, setCurrentUser] = useState(
    localStorage.getItem("current_user")
  );
  const [projectId, setProjectId] = useState(localStorage.getItem("projectId"));
  const [projectNameInput, setProjectNameInput] = useState("");

  const [images, setImages] = useState([]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      setProjectId(localStorage.getItem("projectId"));
    }
  }, [projectId]);

  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tutorial");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          `Cloudinary upload failed: ${response.status} ${
            response.statusText
          } - ${error.error?.message || JSON.stringify(error)}`
        );
      }

      const data = await response.json();

      return {
        url: data.url,
        public_id: data.public_id,
      };
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      throw err;
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploaded = await uploadToCloudinary(file);
      setImages((prev) => [
        ...prev,
        {
          src: uploaded.url,
          x: 50,
          y: 50,
          scale: 1,
          public_id: uploaded.public_id,
        },
      ]);
    } catch (error) {
      toast.error("Failed to upload furniture image.");
    }
  };

  const handleBgImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploaded = await uploadToCloudinary(file);
      setBgImage({ url: uploaded.url, public_id: uploaded.public_id });
    } catch (error) {
      toast.error("Failed to upload background image.");
    }
  };

  const handleSelect = (index, e) => {
    const image = images[index];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - image.x;
    const offsetY = e.clientY - rect.top - image.y;
    setSelectedImageIndex(index);
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedImageIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    setImages((prev) => {
      const newImages = [...prev];
      newImages[selectedImageIndex].x = x;
      newImages[selectedImageIndex].y = y;
      return newImages;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScale = (factor) => {
    if (selectedImageIndex === null) return;
    setImages((prev) => {
      const newImages = [...prev];
      newImages[selectedImageIndex].scale *= factor;
      return newImages;
    });
  };

  const handleDelete = () => {
    if (selectedImageIndex === null) return;
    setImages((prev) => prev.filter((_, i) => i !== selectedImageIndex));
    setSelectedImageIndex(null);
  };

  const handleWidthChange = (e) => {
    const value = e.target.value;
    if (value && !isNaN(value)) {
      setCanvasWidth(Number(value));
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value && !isNaN(value)) {
      setCanvasHeight(Number(value));
    }
  };

  const selectBackground = () => {
    setSelectedImageIndex(null);
  };

  const saveDesign = async () => {
    if (!projectId) {
      toast.error("No project ID, please set project name first.");
      return;
    }
    setIsSaving(true);
    setSaveMessage("");

    try {
      const imagesData = images.map(({ src, x, y, scale, public_id }) => ({
        src,
        x,
        y,
        scale,
        public_id,
      }));

      const designData = {
        projectName,
        images: imagesData,
        bgColor,
        bgImageUrl: bgImage ? bgImage.url : null,
        bgImagePublicId: bgImage ? bgImage.public_id : null,
        canvasWidth,
        canvasHeight,
        updatedAt: serverTimestamp(),
      };

      const projectDocRef = doc(db, "designs", projectId);
      await updateDoc(projectDocRef, designData);

      toast.success("Design updated successfully!");
    } catch (error) {
      console.error("Error updating design:", error);
      toast.error("Failed to update design.");
    }
    setIsSaving(false);
  };

  const createProject = async () => {
    const trimmedName = projectNameInput.trim();
    if (!trimmedName) {
      toast.error("Please enter a valid project name");
      return;
    }
    setIsSaving(true);
    setSaveMessage("");

    try {
      const docRef = await addDoc(collection(db, "designs"), {
        projectName: trimmedName,
        user: current_user,
        images: [],
        bgColor: "#ffffff",
        bgImageUrl: null,
        bgImagePublicId: null,
        canvasWidth: 800,
        canvasHeight: 600,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      localStorage.setItem("projectId", docRef.id);
      localStorage.setItem("ProjectName", trimmedName);
      setProjectName(trimmedName);
      setProjectId(docRef.id);
      setImages([]);
      setBgColor("#ffffff");
      setBgImage(null);
      setCanvasWidth(800);
      setCanvasHeight(600);
      toast.success("Project created! You can start designing.");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
    setIsSaving(false);
  };

  const exittheDesign = async () => {
    localStorage.removeItem("projectId");
    localStorage.removeItem("ProjectName");
    toast.success("Exiting design");
    window.location.reload();
  };

  if (!projectId) {
    return (
      <>
        <Sidebar />
        <div className="p-4 sm:ml-64 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Enter Project Name
            </h2>
            <input
              type="text"
              placeholder="Project Name"
              value={projectNameInput}
              onChange={(e) => setProjectNameInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createProject();
                }
              }}
              autoFocus
            />
            <button
              onClick={createProject}
              disabled={isSaving}
              className={`w-full py-2 rounded text-white font-semibold focus:outline-none focus:ring-2 ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isSaving ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-16">
          <div className="w-full mx-auto p-6 space-y-6">
            <header className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800">
                Project: {projectName}
              </h1>
              <p className="text-gray-500">
                Upload and arrange furniture in 2D view
              </p>
            </header>
            <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="grid grid-cols-1 items-center justify-center md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <label
                    htmlFor="bg-color"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Background Color
                  </label>
                  <div className="relative">
                    <input
                      id="bg-color"
                      type="color"
                      onChange={(e) => setBgColor(e.target.value)}
                      value={bgColor}
                      className="w-full h-10 rounded-md cursor-pointer "
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <span className="text-xs text-gray-500">Pick color</span>
                    </div>
                  </div>
                </div>

                {[
                  {
                    id: "bg-image",
                    label: "Background Image",
                    handler: handleBgImageUpload,
                  },
                  {
                    id: "furniture-image",
                    label: "Furniture Image",
                    handler: handleImageUpload,
                  },
                ].map((upload) => (
                  <div
                    key={upload.id}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <label
                      htmlFor={upload.id}
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {upload.label}
                    </label>
                    <div className="relative group">
                      <input
                        id={upload.id}
                        type="file"
                        accept="image/*"
                        onChange={upload.handler}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center h-10 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md group-hover:border-blue-500 transition-colors">
                        <svg
                          className="w-5 h-5 text-gray-400 mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        <span className="text-xs text-gray-500">
                          Click to upload
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Canvas Size
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        id="canvas-width"
                        type="number"
                        value={canvasWidth}
                        onChange={handleWidthChange}
                        className="w-full p-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 "
                        placeholder="Width"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        id="canvas-height"
                        type="number"
                        value={canvasHeight}
                        onChange={handleHeightChange}
                        className="w-full p-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 "
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-1 flex flex-col justify-end h-full">
                  <button
                    onClick={saveDesign}
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-md transition-all ${
                      isSaving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:from-green-600 hover:to-green-700 text-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save Design"}
                  </button>
                </div>

                <div className="md:col-span-2 lg:col-span-1 flex flex-col justify-end h-full">
                  <button
                    onClick={exittheDesign}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-md transition-all bg-red-500 hover:from-red-600 hover:to-red-700  text-white shadow-sm hover:shadow-md`}
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>

            {selectedImageIndex !== null && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg border border-gray-200 mt-4 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <button
                    onClick={() => handleScale(1.1)}
                    className="h-12 w-12 bg-blue-600 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                  >
                    <i className="ri-expand-diagonal-2-line text-white"></i>
                    <span className="absolute -mt-12 hidden group-hover:block px-2 py-1 text-sm bg-gray-800 text-white rounded-md shadow-sm">
                      Zoom In
                    </span>
                  </button>

                  <button
                    onClick={() => handleScale(0.9)}
                    className="h-12 w-12 bg-blue-400 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                  >
                    <i className="ri-collapse-diagonal-2-line text-white"></i>
                    <span className="absolute -mt-12 hidden group-hover:block px-2 py-1 text-sm bg-gray-800 text-white rounded-md shadow-sm">
                      Zoom Out
                    </span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="h-12 w-12 bg-red-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group hover:animate-shake"
                  >
                    <i className="ri-delete-bin-7-fill text-white"></i>
                    <span className="absolute -mt-12 hidden group-hover:block px-2 py-1 text-sm bg-gray-800 text-white rounded-md shadow-sm">
                      Delete
                    </span>
                  </button>

                  <button
                    onClick={selectBackground}
                    className="p-3 bg-purple-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                  >
                    <span className="text-white font-medium">Deselect All</span>
                    <span className="absolute -mt-12 hidden group-hover:block px-2 py-1 text-sm bg-gray-800 text-white rounded-md shadow-sm">
                      Clear Selection
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div
              ref={canvasRef}
              className="relative border rounded-lg overflow-hidden mt-6 touch-none"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: bgColor,
                backgroundImage: bgImage ? `url(${bgImage.url})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchMove={(e) => {
                if (!isDragging || selectedImageIndex === null) return;
                const touch = e.touches[0];
                const rect = canvasRef.current.getBoundingClientRect();
                const x = touch.clientX - rect.left - dragOffset.x;
                const y = touch.clientY - rect.top - dragOffset.y;
                setImages((prev) => {
                  const newImages = [...prev];
                  newImages[selectedImageIndex].x = x;
                  newImages[selectedImageIndex].y = y;
                  return newImages;
                });
              }}
              onTouchEnd={() => {
                setIsDragging(false);
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt="Furniture"
                  className={`absolute cursor-move select-none ${
                    selectedImageIndex === index
                      ? "border-4 border-blue-500"
                      : ""
                  }`}
                  style={{
                    top: img.y,
                    left: img.x,
                    transform: `scale(${img.scale})`,
                    transformOrigin: "top left",
                    maxWidth: "200px",
                    touchAction: "none",
                  }}
                  onMouseDown={handleSelect.bind(null, index)}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const rect = canvasRef.current.getBoundingClientRect();
                    handleSelect(index, {
                      clientX: touch.clientX,
                      clientY: touch.clientY,
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
