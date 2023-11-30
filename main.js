import AirPlane from './ressources/plane.js';
import Lava from './ressources/lava.js';
import Ground from './ressources/ground.js';
import Sky from './ressources/sky.js';
import Bonus from './ressources/bonus.js';
import Malus from './ressources/malus.js';
import Sun from './ressources/sun.js';
import Trees from './ressources/trees.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('load', init, false);

// STRUCTURE
async function init() {
	createScene();
	createLights();
	createPlane();
	createLava();
	createSky();
  const model = await createBird();
  document.addEventListener('mousemove', handleMouseMove, false);
	loop();
  renderer.render(scene, camera);
}
var gameIsLive = false;
document.getElementById('game-container').addEventListener('click', startGame);
var infoBox = document.getElementById('info-container');
infoBox.style.display = 'none';

var scoreBox = document.getElementById('score');
var lifeBox = document.getElementById('life');

function startGame() {
  life = 5;
	airplane.mesh.position.y = 100;
	gameIsLive = true;
  createBonus();
  createMalus();
  lifeBox.textContent = "Nombre de vie restante: " + life;
  document.getElementById('playButton').style.display = 'none';
	infoBox.style.display = 'flex';
  document.getElementById('game-container').removeEventListener('click', startGame);
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
	// Get the width and the height of the screen,
	// use them to set up the aspect ratio of the camera 
	// and the size of the renderer.
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	// Create the scene
	scene = new THREE.Scene();

	// Add a fog effect to the scene; same color as the
	// background color used in the style sheet
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
	
	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);
	
	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 220;
	camera.position.y = 100;
	
	// Create the renderer
	renderer = new THREE.WebGLRenderer({ 
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true, 

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true 
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);
	
	// Enable shadow rendering
	renderer.shadowMap.enabled = true;
	
	// Add the DOM element of the renderer to the 
	// container we created in the HTML
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	
	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

// LIGHTS
var hemisphereLight, shadowLight, ambientLight;

function createLights() {
	// A hemisphere light is a gradient colored light; 
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xFFFFFF,0x000000, 2)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, 4);
  ambientLight = new THREE.AmbientLight(0xece1bc, .5);

	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
    scene.add(ambientLight);
}

// Instantiate the lava and add it to the scene:
var lava, sky, airplane, lava1, sun, trees;

function createLava(){
	lava = new Lava();
	// push it a little bit at the bottom of the scene
	lava.mesh.position.y = -500;
	// add the mesh of the lava to the scene
	scene.add(lava.mesh);

  lava1 = new Ground();
  lava1.mesh.position.y = -500;
  scene.add(lava1.mesh);

  trees = new Trees();
  trees.mesh.position.y = -500;
  trees.mesh.position.x = 1300;
  scene.add(trees.mesh);
}

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = 500;
	scene.add(sky.mesh);

  sun = new Sun();
	sun.mesh.position.y = 300;
	sun.mesh.position.x = 300;
	scene.add(sun.mesh);
}

function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25,.25,.25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}
var loader, customModel;
function createBird() {
   loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
	// resource URL
	'ressources/model/flying_bird/scene.gltf',
	// called when the resource is loaded
	 ( gltf ) => {
        gltf.scene.position.y = 150;
        gltf.scene.position.x = 100;
        gltf.scene.rotation.y = 8;
        gltf.scene.scale.set(30, 30, 30);
        gltf.scene.castShadow = true;
        gltf.scene.receiveShadow = true;
        scene.add(gltf.scene);
        customModel = gltf.scene;
	})
}

// BONUS AND MALUS MANAGEMENT

var bonusArray = []; // Create an array to store all the bonus

function createBonus(){
    for (var i = 0; i < 3; i++) { 
        var bonus = new Bonus();
        bonus.mesh.position.y = Math.random() * 150 + 50;
        bonus.mesh.position.x = window.innerWidth / 2 + i * 100;
        scene.add(bonus.mesh);
        bonusArray.push(bonus);
    }
    animateBonus();
}

var animationBonusId;
function animateBonus() {
    animationBonusId = requestAnimationFrame(animateBonus);
    for (var i = 0; i < bonusArray.length; i++) {
        var bonus = bonusArray[i];
        bonus.mesh.position.x -= 2;

        if (bonus.mesh.position.x < -window.innerWidth / 2) {
            bonus.mesh.position.x = window.innerWidth / 2;
            bonus.mesh.position.y = Math.random() * 150 + 50;
        }
    }
}

var malusArray = []; // Create an array to store all the malus

function createMalus(){
    for (var i = 0; i < 5; i++) { // Create 5 malus
        var malus = new Malus();
        malus.mesh.position.y = Math.random() * 150 + 50;
        malus.mesh.position.x = window.innerWidth / 2 + i * 100; // Spread out the malus
        scene.add(malus.mesh);
        malusArray.push(malus); // Add the malus to the array
    }
    animateMalus();
}

var animationMalusId;
function animateMalus() {
    animationMalusId = requestAnimationFrame(animateMalus);
    for (var i = 0; i < malusArray.length; i++) { // Animate each malus
        var malus = malusArray[i];
        malus.mesh.position.x -= 3;

        if (malus.mesh.position.x < -window.innerWidth / 2) {
            malus.mesh.position.x = window.innerWidth / 2;
            malus.mesh.position.y = Math.random() * 150 + 50;
        }
    }
}

var mousePos={x:0, y:0};

function handleMouseMove(event) {

	// here we are converting the mouse position value received 
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:
	
	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula 
	// because the 2D y-axis goes the opposite direction of the 3D y-axis
	
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};
}

function updateCamera() {
    var airplanePos = {x: airplane.mesh.position.x / window.innerWidth, y: airplane.mesh.position.y / window.innerHeight};
    var dx = airplanePos.x - mousePos.x;
    var dy = airplanePos.y - mousePos.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // Adjust the camera position based on the distance
    // You can adjust the factor 0.01 to get the desired effect
    camera.position.z = 150 + distance * 100; // Increase the factor to make the effect more noticeable
}

var score = 0;
var life = 5;
var isPushedBack = false;

function loop(){
  sky.mesh.position.x -= 3;
  if (sky.mesh.position.x < -window.innerWidth - 1500) {
      sky.mesh.position.x = window.innerWidth + 1500;
  }
  // Move the first lava object
  lava.mesh.position.x -= 3;
  if (lava.mesh.position.x < -window.innerWidth - 1000) {
      lava.mesh.position.x = window.innerWidth / 1;
  }
  // Move the first lava object
  sun.mesh.position.x -= .5;
  if (sun.mesh.position.x < -window.innerWidth ) {
      sun.mesh.position.x = window.innerWidth / 1.5;
  }

  // Move the first lava object
  trees.mesh.position.x -= 3;
  if (trees.mesh.position.x < -window.innerWidth - 1000) {
    trees.mesh.position.x = window.innerWidth / 1;
  }
  if (customModel) {
    customModel.position.x -= 2;
    if (customModel.position.x < -window.innerWidth) {
      customModel.position.x = window.innerWidth;
    }
  }

  var airplaneBox = new THREE.Box3().setFromObject(airplane.mesh);

	for (var i = 0; i < bonusArray.length; i++) { // Check each bonus
        var bonusBox = new THREE.Box3().setFromObject(bonusArray[i].mesh);

		// Rotate animation for bonus
		bonusArray[i].mesh.rotation.x += 0.04;
    	bonusArray[i].mesh.rotation.y += 0.04;

        if (airplaneBox.intersectsBox(bonusBox)) {
            score++;
            console.log("Cobalt Points: " + score);
            scoreBox.textContent = "Cobalt Points: " + score;
            bonusArray[i].mesh.position.x = window.innerWidth / 2; // Reset bonus position
            bonusArray[i].mesh.position.y = Math.random() * 150 + 50; // Random y position between 50 and 200
            showPlusOne(airplane.mesh.position); // Show the "+1" text
        }
    }

    for (var i = 0; i < malusArray.length; i++) { // Check each malus
        var malusBox = new THREE.Box3().setFromObject(malusArray[i].mesh);

        if (airplaneBox.intersectsBox(malusBox)) {
            life--;
            console.log("Nombre de vie restante: " + life);
            lifeBox.textContent = "Nombre de vie restante: " + life;
            malusArray[i].mesh.position.x = window.innerWidth / 2; // Reset malus position
            malusArray[i].mesh.position.y = Math.random() * 150 + 50; // Random y position between 50 and 200

            isPushedBack = true;
        }
    }
	if (isPushedBack) {
		PushBack();
	}
	// update the plane on each frame
	updatePlane();

	if (gameIsLive) {
		updateCamera();
	}

  if (life === 0) {
    stopGame();
  }
	
	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}

function PushBack() {
    airplane.mesh.position.x -= 1.5; // Decrease the x position
    setTimeout(function() { 
            airplane.mesh.position.x += 1.5; 
            isPushedBack = false;
    }, 300); // Move the plane forward after 1 second
}

function updatePlane(){
	var targetY = normalize(mousePos.y,-.75,.75,25, 175);
	
	// Move the plane at each frame by adding a fraction of the remaining distance
	airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;

	// Rotate the plane proportionally to the remaining distance
	airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
	airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;

	airplane.propeller.rotation.x += 0.25;
}

function normalize(v,vmin,vmax,tmin, tmax){

	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

function stopGame() {
    gameIsLive = false;
    lifeBox.textContent = "Vous avez perdu!";
    document.getElementById('playButton').style.display = 'block';
    document.getElementById('game-container').addEventListener('click', startGame);
    deleteMalus();
    deleteBonus();
    airplane.mesh.position.y = -1;
}

function deleteMalus() {
  for (var i = 0; i < malusArray.length; i++) { // Loop through each malus
      var malus = malusArray[i];
      scene.remove(malus.mesh); // Remove the malus from the scene
  }
  malusArray = []; // Empty the malusArray
  cancelAnimationFrame(animationMalusId);
}
function deleteBonus() {
  for (var i = 0; i < bonusArray.length; i++) { // Loop through each malus
      var bonus = bonusArray[i];
      scene.remove(bonus.mesh); // Remove the malus from the scene
  }
  bonusArray = []; // Empty the malusArray
  cancelAnimationFrame(animationBonusId);
}

function showPlusOne(airplanePosition) {
  var plusOne = document.getElementById('plusOne');
  plusOne.style.left = '50%';
  plusOne.style.top = '50%';
  plusOne.style.opacity = 1;

  // Animate the "+1" text to move up and fade out
  setTimeout(function() {
      plusOne.style.top = (airplanePosition.y - 50) + 'px';
      plusOne.style.opacity = 0;
  },0);
}