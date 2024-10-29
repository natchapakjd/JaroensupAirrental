// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';

// const ThreeScene = () => {
//   const mountRef = useRef(null);
//   const [width, setWidth] = useState(5); // Default width of grid
//   const [height, setHeight] = useState(5); // Default height of grid
//   const [scene, setScene] = useState(null); // Track scene object
//   const [renderer, setRenderer] = useState(null); // Track renderer object
//   const [camera, setCamera] = useState(null); // Track camera object

//   useEffect(() => {
//     // Set up scene
//     const newScene = new THREE.Scene();
//     setScene(newScene);

//     // Set up camera
//     const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     newCamera.position.z = 20; // Adjust as needed to view the entire grid
//     setCamera(newCamera);

//     // Set up renderer
//     const newRenderer = new THREE.WebGLRenderer({ antialias: true });
//     newRenderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(newRenderer.domElement);
//     setRenderer(newRenderer);

//     // Handle window resize
//     const handleResize = () => {
//       if (newCamera) {
//         newCamera.aspect = window.innerWidth / window.innerHeight;
//         newCamera.updateProjectionMatrix();
//       }
//       if (newRenderer) {
//         newRenderer.setSize(window.innerWidth, window.innerHeight);
//       }
//     };
//     window.addEventListener('resize', handleResize);

//     // Cleanup function
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (newRenderer && mountRef.current) {
//         mountRef.current.removeChild(newRenderer.domElement);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (scene && renderer && camera) {
//       // Function to create a grid of cubes with outlines
//       const createGrid = (width, height) => {
//         const grid = new THREE.Group();
//         const cubeSize = 1; // Size of each cube
//         const spacing = 0.2; // Slight spacing to separate cubes visually
//         const borderColor = 0x000000; // Color for the borders

//         const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, flatShading: true }); // Better material for shading
//         const borderMaterial = new THREE.LineBasicMaterial({ color: borderColor }); // Border color

//         for (let i = 0; i < width; i++) {
//           for (let j = 0; j < height; j++) {
//             // Create cube
//             const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
//             const cube = new THREE.Mesh(geometry, material);
//             cube.position.set(
//               i * (cubeSize + spacing) - (width * (cubeSize + spacing)) / 2, // Center the grid
//               j * (cubeSize + spacing) - (height * (cubeSize + spacing)) / 2,
//               0
//             );
//             grid.add(cube);

//             // Create outline
//             const edges = new THREE.EdgesGeometry(geometry);
//             const lineSegments = new THREE.LineSegments(edges, borderMaterial);
//             lineSegments.position.copy(cube.position);
//             grid.add(lineSegments);
//           }
//         }

//         return grid;
//       };

//       // Create grid and add to scene
//       const grid = createGrid(width, height);
//       scene.clear(); // Remove previous objects
//       scene.add(grid);

//       // Add a light to improve visual appeal
//       const light = new THREE.DirectionalLight(0xffffff, 1);
//       light.position.set(10, 10, 10);
//       scene.add(light);
//       const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light
//       scene.add(ambientLight);

//       // Render loop
//       const animate = () => {
//         requestAnimationFrame(animate);
//         // Apply rotation
//         grid.rotation.y += 0.01;
//         grid.rotation.x += 0.01;
//         renderer.render(scene, camera);
//       };
//       animate();
//     }
//   }, [scene, renderer, camera, width, height]); // Depend on scene, renderer, camera, width, and height

//   return (
//     <div>
//       <div
//         ref={mountRef}
//         style={{
//           width: '80%',
//           height: '80vh',
//           display: 'block',
//           backgroundColor: '#f0f0f0',
//         }}
//       />
//       <div style={{ padding: '10px', background: '#fff' }}>
//         <label htmlFor="widthInput">Width: </label>
//         <input
//           id="widthInput"
//           type="number"
//           value={width}
//           onChange={(e) => setWidth(parseInt(e.target.value, 10))}
//           min="1"
//           style={{ marginLeft: '10px' }}
//         />
//         <br />
//         <label htmlFor="heightInput">Height: </label>
//         <input
//           id="heightInput"
//           type="number"
//           value={height}
//           onChange={(e) => setHeight(parseInt(e.target.value, 10))}
//           min="1"
//           style={{ marginLeft: '10px' }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ThreeScene;


import React from 'react'

const ThreeScene = () => {
  return (
    <div>ThreeScene</div>
  )
}

export default ThreeScene