var Colors = {
    green:0x009A17,
};

export default function Ground(){
	
	var geomGround = new THREE.BoxGeometry(1500,600,600);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.green,
		opacity:.6,
		flatShading:true
	});

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	var ground = new THREE.Mesh(geomGround, mat);
	ground.position.y = 150;
	ground.castShadow = true;
	ground.receiveShadow = true;

	// Allow the rockyGround to receive shadows
	this.mesh = new THREE.Object3D();
	this.mesh.add(ground);
	this.mesh.receiveShadow = true;
}