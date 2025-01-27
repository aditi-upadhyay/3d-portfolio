import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './Home.css';

const ThreeHome = () => {
  const [introductionVisible, setIntroductionVisible] = useState(true);
  const [description, setDescription] = useState(false);  // Track if description is visible
  const [cameraZoom, setCameraZoom] = useState(false);
  let scene, camera, renderer, animationFrameId, controls;
  const introductionRef = useRef(null);
  const sceneRef = useRef(null);  // Track scene to avoid re-loading the model
  const modelRef = useRef(null);  // Store the model reference for easier access
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const counterRef = useRef(15);  // Avoid unnecessary re-renders of the counter
  let counter = 15
  let introRotation = 0
  window.counter = counter

  
  useEffect(() => {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    sceneRef.current = scene;

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight); // Full window size
    renderer.setPixelRatio(window.devicePixelRatio); // High-quality rendering
    rendererRef.current = renderer;

    // Avoid creating multiple canvases
    const existingCanvas = document.getElementById('modelCanvas');
    if (existingCanvas) existingCanvas.remove();
    renderer.domElement.id = 'modelCanvas';  // Set a unique ID for the canvas

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(ambientLight, directionalLight);
    window.camera = camera
    window.scene = scene
    // Load GLTF model (only once)
    const loader = new GLTFLoader();
    loader.load('/models/studio__office__interior/scene.gltf', (gltf) => {
      const object = gltf.scene;
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      object.position.set(-center.x, -center.y, -center.z);
      const maxDimension = Math.max(size.x, size.y, size.z);
      object.scale.setScalar(180 / maxDimension);

      scene.add(object);
      object.position.set(0, -18, 10);
      object.rotation.set(0, -9.4, 0);
      modelRef.current = object;  // Save the model reference for later use
    });

    // Add font
    // Load a font
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/Marcellus_Regular.json', (font) => {
      console.log('Font loaded successfully!');
      const textGeometry = new TextGeometry('My name is Aditi Upadhyay I am an ', {
        font: font,
        size: 1, // Size of the text
        height: 0.1, // Depth of the text
        curveSegments: 12, // Number of curves
        bevelEnabled: true, // Enable bevel effect
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Tomato color
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Position the text
      textMesh.position.set(-9,-9,55);
      scene.add(textMesh);
    });

    const font = new FontLoader();
    font.load('/fonts/Barriecito_Regular.json', (font) => {
      console.log('Font loaded successfully!');
      const textGeometry = new TextGeometry('Software Engineer ', {
        font: font,
        size: 1, // Size of the text
        height: 0.1, // Depth of the text
        curveSegments: 12, // Number of curves
        bevelEnabled: true, // Enable bevel effect
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Tomato color
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Position the text
      textMesh.position.set(-4.5,-12,55);
      scene.add(textMesh);
    });

    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true; 
    // controls.dampingFactor = 0.05; 
    // controls.minDistance = 10; 
    // controls.maxDistance = 500; 

    // Animation loop (renders once per frame)
    
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const modelContainer = document.getElementById('modelContainer');
    if (modelContainer) {
      modelContainer.appendChild(renderer.domElement);
    }

    // Resize handler for responsiveness
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      const canvas = document.getElementById('modelCanvas');
      if (canvas) {
        canvas.remove();
      }
    };
  }, []);  // Only run once on mount

  const handleScroll = (event) => {
    const model = modelRef.current;
    const currentRotation = model.rotation;

    // Map rotation to position of the description text container
    const mapRotationToPosition = (rotation) => {
      const minRotation = -10;
      const maxRotation = 0;
      const minPosition = 10;
      const maxPosition = 90;

      const normalizedRotation = (rotation - minRotation) / (maxRotation - minRotation);
      const mappedPosition = minPosition + normalizedRotation * (maxPosition - minPosition);

      return Math.min(Math.max(mappedPosition, minPosition), maxPosition);
    };

    if (event.deltaY < 0) {
      console.log("zoom out ....")
      if (model.rotation.y >= -9.99) {
        // setIntroductionVisible(true);
        cameraRef.current.position.z -= 0.5;
        if (cameraRef.current.position.z < 50) {
          cameraRef.current.position.z = 105;
        }
      }

      // const container = document.getElementById('introductionContainer');
      // // if (container) {
      // //   const newPosition = mapRotationToPosition(model.rotation.y);
      // //   container.style.left = `${newPosition + counterRef.current}%`;
      // //   counterRef.current += 2.5;
      // // }
      // if (container) {
      //   const newPosition = mapRotationToPosition(model.rotation.y);
      //   console.log(" counter ....",counter)
      //   container.style.left = `${newPosition + counter}%`;  // Update with new position based on rotation
      //   console.log("Upadting the counter ....",counter)
      //   counter = counter + 2.5
      //   container.style.rotate = `${introRotation}deg`;
      //   introRotation = introRotation - 1

      // }
    } else if (event.deltaY > 0) {
      console.log("zoom in ....")
      if (model.rotation.y === -10.999999999999995) {
        // setDescription(true);
      }

      // const container = document.getElementById('introductionContainer');
      // if (container) {
      //     const newPosition = mapRotationToPosition(model.rotation.y);
      //     console.log(" counter ....",counter)
      //     container.style.left = `${newPosition + counter}%`;  // Update with new position based on rotation
      //     console.log("Upadting the counter ....",counter)
      //     counter = counter - 2.5
      //     container.style.rotate = `${introRotation}deg`;
      //     introRotation = introRotation + 1

      //   }

      if (description) {
        console.log('Description is now true, no further actions');
       
        cameraRef.current.position.z += 0.2
       
        if(cameraRef.current.position.z === 60){
          // setDescription(false)
        }
      
        return;
      }else{
        console.log("description is false ")
      }

      if (!description && model.rotation.y <= -9.99) {
        console.log("in if ....")
        setIntroductionVisible(false);
        cameraRef.current.position.z += 0.5;
        if (cameraRef.current.position.z > 50) {
          cameraRef.current.position.z = 50;
        }
      }

      model.rotation.set(0, currentRotation.y - 0.1, 0);
    }

    event.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [description]);  // Run scroll handler setup only once or when description changes

  return (
    <div>
      <div
        id="modelContainer"
        style={{
          width: '100vw',
          height: '100vh',
          margin: '0',
          padding: '0',
          overflow: 'hidden',
          background: '#f0f0f0',
          position: 'absolute',
          top: '0',
          left: '0',
        }}
      />
      {/* {introductionVisible && (
        <div id="introductionContainer" className="introduction">
          <p>My Name Is Aditi Upadhyay, I am a</p>
          <span className="fancy-font">Software Engineer</span>
        </div>
      )}

      {description && (
        <div className="description">
          <span style={{ color: '#3b73a0', fontSize: '13px', textDecoration: 'underline' }}>
            A short description about me :
          </span>
          <br />
          <div className="bullet-list">
            <span className="bullet-item">
              I am based in Mumbai, Maharashtra with over 2 years of professional experience
            </span>
            <span className="bullet-item">
              My experience lies in building frontend and 3D websites, desktop applications, and doing backend as needed
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ThreeHome;
