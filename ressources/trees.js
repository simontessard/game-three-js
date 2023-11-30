var Colors = {
    green:0x009A17,
    darkgreen:0x006400,
};

export default function Trees(){
	
	var geomGround = new THREE.BoxGeometry(1500,600,600);
	var mat = new THREE.MeshPhongMaterial({
        color:Colors.green,
		opacity:.6,
		flatShading:true
	});
	var matTree = new THREE.MeshPhongMaterial({
		color:Colors.green,
		flatShading:true
	});

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	var ground = new THREE.Mesh(geomGround, mat);
	ground.position.y = 150;
	ground.castShadow = true;
	ground.receiveShadow = true;

    for (var i = 0; i < 50; i++) { 

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    var leaveDarkMaterial = new THREE.MeshLambertMaterial( { color: Colors.darkgreen } );
    var leaveLightMaterial = new THREE.MeshLambertMaterial( { color: Colors.darkgreen } );
    var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x7D5A4F } );
  
    var stem = new THREE.Mesh( geometry, stemMaterial );
    stem.position.set( 0, 0, 0 );
    stem.scale.set( 0.3, 1.5, 0.3 );
  
    var squareLeave01 = new THREE.Mesh( geometry, leaveDarkMaterial );
    squareLeave01.position.set( 0.5, 1.6, 0.5 );
    squareLeave01.scale.set( 0.8, 0.8, 0.8 );
  
    var squareLeave02 = new THREE.Mesh( geometry, leaveDarkMaterial );
    squareLeave02.position.set( -0.4, 1.3, -0.4 );
    squareLeave02.scale.set( 0.7, 0.7, 0.7 );
  
    var squareLeave03 = new THREE.Mesh( geometry, leaveDarkMaterial );
    squareLeave03.position.set( 0.4, 1.7, -0.5 );
    squareLeave03.scale.set( 0.7, 0.7, 0.7 );
  
    var leaveDark = new THREE.Mesh( geometry, leaveDarkMaterial );
    leaveDark.position.set( 0, 1.2, 0 );
    leaveDark.scale.set( 1, 2, 1 );
  
    var leaveLight = new THREE.Mesh( geometry, leaveLightMaterial );
    leaveLight.position.set( 0, 1.2, 0 );
    leaveLight.scale.set( 1.1, 0.5, 1.1 );
  
    var tree = new THREE.Group();
    tree.add( leaveDark );
    tree.add( leaveLight );
    tree.add( squareLeave01 );
    tree.add( squareLeave02 );
    tree.add( squareLeave03 );
    tree.add( stem );
		
	var positionX = Math.random() * 2000 - 100;
	tree.position.x = positionX; // Random x position between -300 and 300
	tree.position.y = 300; // Set y position to half of the cylinder height to place it on the surface
	tree.position.z = Math.random() * 250 - 280; // Random z position between -400 and 400
    tree.scale.set( 15, 15, 15 );
	ground.add(tree);
	}

	this.mesh = new THREE.Object3D();
	this.mesh.add(ground);
	this.mesh.receiveShadow = true;
}