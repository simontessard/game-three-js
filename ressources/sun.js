var Colors = {
    yellow:0xFFCC33,
};

export default function Sun(){
	var sunGeometry = new THREE.SphereGeometry(100, 50, 50); // Adjust the size and detail of the sun here
    var sunMaterial = new THREE.MeshBasicMaterial({color: Colors.yellow}); // Set the color of the sun to yellow
    this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);

	this.mesh.position.y = 900; // Adjust the height of the sun here
    this.mesh.position.x = 0;
    this.mesh.position.z = -800;
    this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
}