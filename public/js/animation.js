// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the background color of the scene
scene.background = new THREE.Color(0x000000); // Black background

// Function to generate a random wireframe geometry
function createWireframe() {
    const geometry = new THREE.TetrahedronGeometry(Math.random() * 3 + 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff }));
    line.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
    line.rotationSpeed = Math.random() * 0.02 + 0.01;
    scene.add(line);
    return line;
}

// Generate multiple wireframe geometries
const wireframes = [];
for (let i = 0; i < 20; i++) {
    wireframes.push(createWireframe());
}

camera.position.z = 20;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    wireframes.forEach(wireframe => {
        wireframe.rotation.x += wireframe.rotationSpeed;
        wireframe.rotation.y += wireframe.rotationSpeed;
    });
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

