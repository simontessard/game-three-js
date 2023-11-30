var Colors = {
    green:0x009A17,
    grey:0x808080,
};

export default function RockyGround(){
	
	var geomGround = new THREE.BoxGeometry(1500,600,600);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.green,
		opacity:.6,
		flatShading:true
	});
	var matRock = new THREE.MeshPhongMaterial({
		color:Colors.grey,
		flatShading:true
	});

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	var ground = new THREE.Mesh(geomGround, mat);
	ground.position.y = 150;
	ground.castShadow = true;
	ground.receiveShadow = true;

    for (var i = 0; i < 50; i++) { 
		var geomRock = new THREE.DodecahedronGeometry(30, 0); 
		var rock = new THREE.Mesh(geomRock, matRock);
		var positionX = Math.random() * 2000 - 100;
		rock.position.x = positionX; // Random x position between -300 and 300
		rock.position.y = 300; // Set y position to half of the cylinder height to place it on the surface
		rock.position.z = Math.random() * 250 - 280; // Random z position between -400 and 400
		ground.add(rock);
	}

	// Allow the rockyGround to receive shadows
	this.mesh = new THREE.Object3D();
	this.mesh.add(ground);
	this.mesh.receiveShadow = true;
}