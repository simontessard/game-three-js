var Colors = {
    red: 0xcc0000,
};

export default function Heart(){
	
	var heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    var geometry = new THREE.ExtrudeGeometry(
      heartShape,
      this.extrudeSettings
    );

    var material = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: true
    });

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	this.mesh = new THREE.Mesh(geometry, material);
}