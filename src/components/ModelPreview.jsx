import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const ModelPreview = ({ modelUrl }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);

    const camera = new THREE.PerspectiveCamera(
      35,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    const fileExt = modelUrl.split(".").pop().toLowerCase();

    if (fileExt === "glb" || fileExt === "gltf") {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          scene.add(gltf.scene);
          animate();
        },
        undefined,
        (error) => {
          console.error("GLTF load error:", error);
        }
      );
    } else if (fileExt === "obj") {
      const loader = new OBJLoader();
      loader.load(
        modelUrl,
        (obj) => {
          // Center the model
          const box = new THREE.Box3().setFromObject(obj);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          obj.position.sub(center);

          // Scale to fit
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 0.3; // Adjust if needed
          obj.scale.setScalar(scale);

          scene.add(obj);

          // Zoom out slightly by moving the camera farther
          camera.position.set(0, 0, 0); // increase Z for zoom out
          controls.update();

          animate();
        },

        undefined,
        (error) => {
          console.error("OBJ load error:", error);
        }
      );
    } else {
      console.error("Unsupported model format:", fileExt);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    return () => {
      mount.innerHTML = "";
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "200px", overflow: "hidden" }}
    />
  );
};

export default ModelPreview;
