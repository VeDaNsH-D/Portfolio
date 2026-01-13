import * as THREE from 'three';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02); // Distance fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 3, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 3. Create "Artifacts" (Your Projects)
const artifacts = [];
const projectData = [
    { title: "Project Alpha", desc: "A high-performance C++ compiler designed for custom architecture.", color: 0xff0055, geometry: new THREE.IcosahedronGeometry(0.8, 0) },
    { title: "Deep Mind", desc: "Neural Network visualization tool built with Python and WebGL.", color: 0x00ffaa, geometry: new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16) },
    { title: "System Zero", desc: "Kernel level anti-cheat system for competitive gaming.", color: 0x5500ff, geometry: new THREE.OctahedronGeometry(0.8, 0) }
];

// Group to hold all artifacts
const artifactGroup = new THREE.Group();
scene.add(artifactGroup);

projectData.forEach((data, index) => {
    // Create Wireframe Material
    const material = new THREE.MeshStandardMaterial({ 
        color: data.color, 
        roughness: 0.2, 
        metalness: 0.8,
        wireframe: true
    });
    
    const mesh = new THREE.Mesh(data.geometry, material);
    
    // Position them in a triangle formation
    const angle = (index / projectData.length) * Math.PI * 2;
    const radius = 2.5;
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    
    // Attach data to the mesh object for retrieval later
    mesh.userData = { title: data.title, desc: data.desc, originalScale: 1 };
    
    artifacts.push(mesh);
    artifactGroup.add(mesh);
});

// 4. Background Particles (The "Stars")
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Random spread
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 5. Interaction Logic (Raycasting)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    // Normalize mouse coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Parallax Effect: Move the group slightly based on mouse
    artifactGroup.rotation.y = mouse.x * 0.1;
    artifactGroup.rotation.x = -mouse.y * 0.1;
}

function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artifacts);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        openModal(object.userData.title, object.userData.desc);
    }
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);

// UI Logic
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeBtn = document.getElementById('close-btn');

function openModal(title, desc) {
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modal.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// 6. Animation Loop
let hoveredObject = null;

function animate() {
    requestAnimationFrame(animate);

    // Rotate the particle field slowly
    particlesMesh.rotation.y += 0.001;

    // Reset scales
    artifacts.forEach(mesh => {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
        mesh.scale.set(1, 1, 1);
    });

    // Raycast for Hover Effect
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artifacts);

    if (intersects.length > 0) {
        // Enlarge and spin faster on hover
        hoveredObject = intersects[0].object;
        hoveredObject.scale.set(1.2, 1.2, 1.2);
        hoveredObject.rotation.x += 0.05;
        hoveredObject.rotation.y += 0.05;
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
        hoveredObject = null;
    }

    renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
