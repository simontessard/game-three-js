import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Bird() {   
	// Instantiate a loader
this.loader = new GLTFLoader();
this.scene = {};
this.theModel = {};

// Load a glTF resource
this.loader.load(
	// resource URL
	'ressources/model/flying_bird/scene.gltf',
	// called when the resource is loaded
	 ( gltf ) => {
        gltf.scene.position.x = Math.floor(Math.random() * 101) + 50;
        gltf.scene.position.y = Math.floor(Math.random() * 101) + 50;
        gltf.scene.rotation.y = 1;
        gltf.scene.rotation.x = 10;
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.castShadow = true;
        gltf.scene.receiveShadow = true;
        this.theModel = gltf.scene;
        this.scene = gltf.scene;
	}
);

}
var birdArray = []; 

export function createBird(scene){
    for (var i = 0; i < 5; i++) { 
        var bird = new Bird();
        birdArray.push(bird);
        bird.loader.load(
            'ressources/model/flying_bird/scene.gltf',
            function ( gltf ) {
                gltf.scene.position.x = Math.floor(Math.random() * 101) + 50;
                gltf.scene.position.y = Math.floor(Math.random() * 101) + 50;
                if (oneBird.scene) {
                    // Animate the bird by changing its properties
                    oneBird.scene.rotation.y += 0.01; // Rotate the bird
                    oneBird.scene.position.x += 1; // Move the bird
                }
                gltf.scene.scale.set(50, 50, 50);
                gltf.scene.castShadow = true;
                gltf.scene.receiveShadow = true;
                scene.add( gltf.scene );
                bird.scene = gltf.scene;
                if (birdArray.length === 5) { // Check if all birds are loaded
                    animateBirds();
                }
            }
        );
    }
}

function animateBirds() {
    requestAnimationFrame(animateBirds);
    for (var i = 0; i < birdArray.length; i++) { // Animate each bird
        var oneBird = birdArray[i];
        // Animate the bird by changing its properties
        oneBird.scene.rotation.y += 0.01; // Rotate the bird
        oneBird.scene.position.x += 1; // Move the bird
    }
}