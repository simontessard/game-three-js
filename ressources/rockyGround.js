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

    var rockPositions = [];

	for (var i = 0; i < 50; i++) {

		var randomHeight = Math.random() * 12 + 25;
  		var randomRotation = Math.random() * Math.PI * 2; // Random rotation in radians

  		var geomRock = new THREE.DodecahedronGeometry(randomHeight, 0); 
  		var rock = new THREE.Mesh(geomRock, matRock);
  		var positionX, positionZ;

  		while (true) {
    	positionX = Math.random() * 2000 - 100;
    	positionZ = Math.random() * 250 - 280;

    	var isTooClose = rockPositions.some(function(pos) {
      	var dx = pos.x - positionX;
      	var dz = pos.z - positionZ;
      	var distance = Math.sqrt(dx * dx + dz * dz);

      	return distance < 50; // Minimum distance between rocks
    	});

    	if (!isTooClose) {
      		break;
    	}
  	}

  		rockPositions.push({ x: positionX, z: positionZ });

  		rock.position.x = positionX;
  		rock.position.y = 300;
		rock.rotation.y = randomRotation;
  		rock.position.z = positionZ;
  		rock.receiveShadow = true;
  		rock.castShadow = true;
  		ground.add(rock);
	}

	// Allow the rockyGround to receive shadows
	this.mesh = new THREE.Object3D();
	this.mesh.add(ground);
	this.mesh.receiveShadow = true;
}