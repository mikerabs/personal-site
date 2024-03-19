// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the background color of the scene
scene.background = new THREE.Color(0x000000); // Black background

// Function to generate a random wireframe geometry with translation and rotation speeds
function createWireframe() {
    const geometries = [
        new THREE.TetrahedronGeometry(Math.random() * 2 + 1),
        new THREE.BoxGeometry(Math.random() * 2 + 1, Math.random() * 2 + 1, Math.random() * 2 + 1),
        new THREE.OctahedronGeometry(Math.random() * 2 + 1),
        new THREE.IcosahedronGeometry(Math.random() * 2 + 1),
    ];
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff }));

    // Set the initial position of the shape to be more spread out
    line.position.set(
        (Math.random() - 0.5) * window.innerWidth * 0.05, // Spread across the X-axis
        (Math.random() - 0.5) * window.innerHeight * 0.05, // Spread across the Y-axis
        (Math.random() - 0.5) * 50 // Spread across the Z-axis
    );

    line.rotationSpeed = Math.random() * 0.02 + 0.01;
    line.translationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
    );

    scene.add(line);
    return line;
}


// Generate multiple wireframe geometries
const wireframes = [];
for (let i = 0; i < 30; i++) { // Increase the number of shapes if desired
    wireframes.push(createWireframe());
}

camera.position.z = 40;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    wireframes.forEach(wireframe => {
        wireframe.rotation.x += wireframe.rotationSpeed;
        wireframe.rotation.y += wireframe.rotationSpeed;
        wireframe.position.add(wireframe.translationSpeed);
        
        // Optional: Add boundaries to keep shapes within view
        ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(wireframe.position[axis]) > 20) {
                wireframe.translationSpeed[axis] *= -1;
            }
        });
    });
    renderer.render(scene, camera);
}

animate();

// Adjust canvas on window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.getElementById("intro").style.display = "block";
    }, 2000); // 2000 milliseconds = 2 seconds
});

