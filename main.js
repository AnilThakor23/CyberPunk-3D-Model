import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // Import RGBELoader
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'; // Import EffectComposer
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'; // Import RenderPass
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'; // Import ShaderPass
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'; // Import RGBShiftShader

const canvas = document.querySelector("#canvas");
let size = {
  width: window.innerWidth,
  height: window.innerHeight
};

//scene
const scene = new THREE.Scene();

let model;

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', (texture) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer); // Use THREE.PMREMGenerator
  const pmremTexture = pmremGenerator.fromEquirectangular(texture).texture;

  scene.environment = pmremTexture; // Set the environment map

  // Load GLTF model after HDRI is loaded
  const loader = new GLTFLoader();
  loader.load(
    "./DamagedHelmet.gltf",
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.envMap = pmremTexture; // Set the environment map for the model
        }
      });
      model = gltf.scene;
      scene.add(model); // Add the loaded model to the scene
    },
    undefined,
    (error) => {
      console.error(error); // Handle loading errors
    }
  );
});

//camera
const camera = new THREE.PerspectiveCamera(
  40,
  size.width / size.height,
  0.1,
  100
);
camera.position.z = 3.5;

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Set tone mapping
renderer.outputEncoding = THREE.sRGBEncoding; // Set output encoding

// Post-processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// RGB Shift effect
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0015
composer.addPass(rgbShiftPass);

// Resize event
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  composer.setSize(size.width, size.height); // Update composer size
});
window.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (event.clientY / window.innerHeight) * 2 - 1.3; // Normalize to -1 to 1
  if(model){
    gsap.to(model.rotation, {
        y: mouseX * (Math.PI / 180) * 10,
        x: mouseY * (Math.PI / 180) * 5,
        duration: 0.9,
        ease: "power2.out"
    });
  }
});

//render
function animate() {
  window.requestAnimationFrame(animate);
  composer.render(); // Use composer to render
}
animate();
//texture loader
//model loader (if need)

//resize   
// pixle ratio  
