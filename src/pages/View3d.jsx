import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import * as THREE from "three";
import { Vector3, DoubleSide } from "three";

function SceneObject({ object, selected, onClick, position }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(object.id);
      }}
    >
      {object.type === "box" && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={selected ? "hotpink" : "orange"} />
        </mesh>
      )}

      {object.type === "obj" && (
        <ObjModel
          objUrl={object.objUrl}
          mtlUrl={object.mtlUrl}
          scale={object.scale}
        />
      )}
    </group>
  );
}

function ControlsPanel({
  onAddBox,
  onAddModel,
  selectedObject,
  onPositionChange,
  workspaceDimensions,
  onWorkspaceChange,
  wallColor,
  floorColor,
  onWallColorChange,
  onFloorColorChange,
  onScaleChange,
}) {
  return (
    <div className="absolute right-0 top-16 p-5 z-10 max-w-xs w-full space-y-6">
      {/* Main Controls Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 space-y-6 border border-gray-100">
        {/* Add Objects Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">3D Item</h2>
          <div className="grid grid-row-2 gap-3">
            <button
              onClick={onAddBox}
              className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <i class="ri-add-large-fill text-xl"></i>
              Add Box
            </button>
            <button
              onClick={onAddModel}
              className="bg-purple-400 hover:bg-purple-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <i class="ri-add-large-fill text-xl"></i>
              Add Model
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">3D Models</h2>
          <div className="relative">
            <input
              type="file"
              multiple
              accept=".obj,.mtl"
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) await onAddModel(files);
              }}
              className="opacity-0 absolute w-full h-full cursor-pointer"
            />
            <button className="w-full bg-green-400 hover:bg-green-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all">
              <i className="ri-upload-line text-xl"></i>
              Upload OBJ Model
            </button>
          </div>
        </div>
        {/* Workspace Dimensions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Room Dimensions
          </h3>
          <div className="space-y-3">
            {["width", "depth", "height"].map((dimension) => (
              <div key={dimension} className="flex items-center gap-3">
                <label className="flex-1 text-sm text-gray-600 capitalize">
                  {dimension}
                </label>
                <input
                  type="number"
                  value={workspaceDimensions[dimension]}
                  onChange={(e) => onWorkspaceChange(dimension, e.target.value)}
                  className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={dimension === "height" ? 3 : 5}
                  max={dimension === "height" ? 50 : 100}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Color Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Color Palette
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={wallColor}
                onChange={(e) => onWallColorChange(e.target.value)}
                className="w-8 h-8 rounded-md border cursor-pointer"
              />
              <span className="text-sm text-gray-600">Walls</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={floorColor}
                onChange={(e) => onFloorColorChange(e.target.value)}
                className="w-8 h-8 rounded-md border cursor-pointer"
              />
              <span className="text-sm text-gray-600">Floor</span>
            </div>
          </div>
        </div>
        {/* Position Controls */}
        {selectedObject && (
          <>
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                select item Position
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      {axis}
                    </label>
                    <input
                      type="number"
                      value={
                        selectedObject.position[
                          axis === "x" ? 0 : axis === "y" ? 1 : 2
                        ]
                      }
                      onChange={(e) => onPositionChange(axis, e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Replace the single scale input with axis-based controls */}
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1"
              value={selectedObject.scale?.[0] ?? 1}
              onChange={(e) => onScaleChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
      </div>
    </div>
  );
}

function Room({ dimensions, wallColor, floorColor }) {
  return (
    <>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[dimensions.width, dimensions.depth]} />
        <meshStandardMaterial color={floorColor} side={DoubleSide} />
      </mesh>

      {/* Walls (update all wall materials) */}
      <mesh position={[0, dimensions.height / 2, -dimensions.depth / 2]}>
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshStandardMaterial color={wallColor} side={DoubleSide} />
      </mesh>

      <mesh
        position={[-dimensions.width / 2, dimensions.height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[dimensions.depth, dimensions.height]} />
        <meshStandardMaterial color={wallColor} side={DoubleSide} />
      </mesh>

      <mesh
        position={[dimensions.width / 2, dimensions.height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[dimensions.depth, dimensions.height]} />
        <meshStandardMaterial color={wallColor} side={DoubleSide} />
      </mesh>
    </>
  );
}

function ObjModel({ objUrl, mtlUrl, position, scale }) {
  const obj = useLoader(OBJLoader, objUrl);

  // Only load MTL if mtlUrl exists
  const materials = useLoader(
    MTLLoader,
    mtlUrl || "" // Fallback to empty string instead of null
  );

  useEffect(() => {
    if (materials && mtlUrl) {
      // Set materials only if loaded successfully
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = materials.materials[child.material.name];
        }
      });
    } else {
      // Apply default material if no MTL
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.2,
            roughness: 0.8,
          });
        }
      });
    }
  }, [obj, materials, mtlUrl]);

  return <primitive object={obj} position={position} scale={scale} />;
}

const View3d = () => {
  const [projectId, setProjectId] = useState(localStorage.getItem("projectId"));
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [workspaceDimensions, setWorkspaceDimensions] = useState({
    width: 15,
    depth: 15,
    height: 6,
  });
  // Add color states
  const [wallColor, setWallColor] = useState("#add8e6");
  const [floorColor, setFloorColor] = useState("#808080");

  // Add workspace handler
  const handleWorkspaceChange = (type, value) => {
    setWorkspaceDimensions((prev) => ({
      ...prev,
      [type]: Math.max(1, parseInt(value) || 1),
    }));
  };

  const addBox = () => {
    const newObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: "box",
      position: [0, 0, 0],
    };
    setObjects([...objects, newObject]);
  };

  const addModel = async (files) => {
    const objFile = files.find((f) => f.name.endsWith(".obj"));
    const mtlFile = files.find((f) => f.name.endsWith(".mtl"));

    // Validate OBJ file exists
    if (!objFile) {
      alert("Please select an OBJ file");
      return;
    }

    // Create safe URLs
    const objUrl = URL.createObjectURL(objFile);
    const mtlUrl = mtlFile ? URL.createObjectURL(mtlFile) : "";

    // Add to state
    setObjects([
      ...objects,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: "obj",
        position: [0, 0, 0],
        objUrl,
        mtlUrl, // Will be empty string if no MTL
      },
    ]);
  };

  const handlePositionChange = (axis, value) => {
    setObjects(
      objects.map((obj) => {
        if (obj.id === selectedId) {
          const newPosition = [...obj.position];
          const axisIndex = { x: 0, y: 1, z: 2 }[axis];
          newPosition[axisIndex] = parseFloat(value) || 0;
          return { ...obj, position: newPosition };
        }
        return obj;
      })
    );
  };

  const handleScaleChange = (value) => {
    const clamped = Math.max(0.01, Math.min(1, parseFloat(value) || 0.01));
    setObjects(
      objects.map((obj) =>
        obj.id === selectedId
          ? { ...obj, scale: [clamped, clamped, clamped] }
          : obj
      )
    );
  };

  const selectedObject = objects.find((obj) => obj.id === selectedId);

  // Add this useEffect in your View3d component
  useEffect(() => {
    return () => {
      objects.forEach((obj) => {
        if (obj.objUrl) URL.revokeObjectURL(obj.objUrl);
        if (obj.mtlUrl) URL.revokeObjectURL(obj.mtlUrl);
      });
    };
  }, [objects]);

  if (!projectId) {
    return (
      <>
        <Sidebar />
        <div className="p-4 sm:ml-64 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              First You Need Create a 2D Design
            </h2>
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
          <div className="w-full h-full">
            <ControlsPanel
              onAddBox={addBox}
              onAddModel={addModel}
              selectedObject={selectedObject}
              onPositionChange={handlePositionChange}
              workspaceDimensions={workspaceDimensions}
              onWorkspaceChange={handleWorkspaceChange}
              wallColor={wallColor}
              floorColor={floorColor}
              onWallColorChange={setWallColor}
              onFloorColorChange={setFloorColor}
              onScaleChange={handleScaleChange}
            />

            <div className="w-[70%] h-[600px] m-2 border ">
              <Canvas camera={{ position: [20, 20, 20], fov: 30 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <directionalLight
                  position={[10, 10, 10]}
                  intensity={1.5}
                  castShadow
                />
                <hemisphereLight
                  skyColor="#ffffff"
                  groundColor="#fffffff"
                  intensity={0.5}
                />

                {objects.map((object) => (
                  <SceneObject
                    key={object.id}
                    object={object}
                    selected={object.id === selectedId}
                    onClick={setSelectedId}
                    position={object.position}
                    scale={object.scale}
                  />
                ))}

                {/* Dynamic Room */}
                <Room
                  dimensions={workspaceDimensions}
                  wallColor={wallColor}
                  floorColor={floorColor}
                />

                {/* Update grid helper to match dimensions */}
                <gridHelper
                  args={[workspaceDimensions.width, workspaceDimensions.depth]}
                />

                <OrbitControls makeDefault />

                <axesHelper args={[6]} />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View3d;
