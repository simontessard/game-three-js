export default function Particles() {   
	// Particle system parameters
    const particleCount = 20; // Adjust the number of particles as desired
    const particleSize = 0.2; // Adjust the size of the particles
    const particleColor = 0xff0000; // Adjust the color of the particles

    // Create the particle system
    this.particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({ size: particleSize, color: particleColor });
    this.mesh = new THREE.Mesh(this.particlesGeometry, particlesMaterial);

    // Generate random particle positions and colors
    const positions = [];
    const colors = [];

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        positions.push(x, y, z);

        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        colors.push(r, g, b);
    }
    this.particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}