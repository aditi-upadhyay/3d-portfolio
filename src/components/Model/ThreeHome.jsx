import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeHome = () => {
  useEffect(() => {
    let scene, camera, renderer, animationFrameId, controls;

    // Initialize scene, camera, and renderer
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    window.camera = camera

    scene = new THREE.Scene();
    window.scene = scene;  

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight); // Full window size
    renderer.setPixelRatio(window.devicePixelRatio); // High-quality rendering

    // avoid rendering multiple canvas
    const existingCanvas = document.getElementById('modelCanvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }
    renderer.domElement.id = 'modelCanvas'; // Set a unique ID for the canvas

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Adjust intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 10, 10);
    scene.add(ambientLight, directionalLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      '/models/studio__office__interior/scene.gltf',
      (gltf) => {
        const object = gltf.scene;

        // Center and scale model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Position the model at the center
        object.position.set(-center.x, -center.y, -center.z);

        // Scale the model proportionally
        const maxDimension = Math.max(size.x, size.y, size.z);
        object.scale.setScalar(180 / maxDimension); // Adjust scale factor for zoomin zoomout

        scene.add(object);

        // Move the model after it has been added to the scene
        // object.position.set(-6, -21, 0);
        // object.rotation.set(0,0.8,0)

        object.position.set(0,-18,10)
        object.rotation.set(0,-9.4,0)
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error.message, error);
      }
    );

    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05; 
    controls.minDistance = 10; 
    controls.maxDistance = 500; 

    // Add text element
    const textElement = document.createElement('div');
    textElement.textContent = 'Model Title';
    textElement.style.position = 'absolute';
    textElement.style.color = 'white';
    textElement.style.fontSize = '24px';
    textElement.style.pointerEvents = 'none'; // Make sure it's not blocking interactions
    document.body.appendChild(textElement);

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update(); 
      renderer.render(scene, camera);
    };
    animate();

    // Append renderer to DOM
    const modelContainer = document.getElementById('modelContainer');
    if (modelContainer) {
      modelContainer.appendChild(renderer.domElement);
      modelContainer.appendChild(textElement);
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

    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      const canvas = document.getElementById('modelCanvas');
      if (canvas) {
        canvas.remove(); 
      }
    };
  }, []);

  return (
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
  );
};

export default ThreeHome;
