import AirPlane from './ressources/plane.js';
import RockyGround from './ressources/rockyGround.js';
import Ground from './ressources/ground.js';
import Sky from './ressources/sky.js';
import Bonus from './ressources/bonus.js';
import Malus from './ressources/malus.js';
import Sun from './ressources/sun.js';
import Trees from './ressources/trees.js';
import Heart from './ressources/heart.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('load', init, false);

// STRUCTURE
async function init() {
	createScene();
	createLights();
	createPlane();
	createRockyGround();
	createSky();
  const model = await createBird();
  document.addEventListener('mousemove', handleMouseMove, false);
	loop();
  renderer.render(scene, camera);
}
var gameIsLive = false;
var planeFlying = true;
var infoBox = document.getElementById('info-container');
infoBox.style.display = 'none';
var modal = document.getElementById('authentication-modal');
var leaderboard = document.getElementById('scoreRanking');
var playButton = document.getElementById('playButton');
playButton.addEventListener('click', startGame);

var sendGiftButton = document.getElementById('giftButton');
var playerName = document.getElementById('name');
var latestScoreNum = null;
sendGiftButton.addEventListener('click', startGame);

var scores = [];

sendGiftButton.addEventListener("click", function(event){
  var score = {
    name: playerName.value,
    score: latestScoreNum
  };
  scores.push(score);

  // Sort scores from highest to lowest
  scores.sort(function(a, b) {
    return b.score - a.score;
  });

  // Clear the leaderboard
  while (leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.firstChild);
  }

  // Add each score to the leaderboard
  scores.forEach(function(score, index) {
    var scoreLine = document.createElement("li");
    if (score.name) {
      scoreLine.textContent = (index + 1) + '. ' + score.name + ' : ' + score.score;
    } else {
      scoreLine.textContent = (index + 1) + '. ' + score.score;
    }
    leaderboard.appendChild(scoreLine);
  });
  event.preventDefault();
});

var scoreBox = document.getElementById('score');

function startGame() {
  life = 5;
  score = 0;
  scoreBox.textContent = "Cobalt Points: " + score;
	airplane.mesh.position.y = 100;
  airplane.mesh.position.x = 0;
  airplane.mesh.visible = true;
	gameIsLive = true;
	planeFlying = true;
  if(!airplane) {
    createPlane();
  }
  createBonus();
  createMalus();
  handleLife();
  modal.style.display = 'none';
  playButton.style.display = 'none';
	infoBox.style.display = 'flex';
  playButton.removeEventListener('click', startGame);
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

// Instantiate the rockyGround and add it to the scene:
var rockyGround, sky, airplane, ground, sun, trees, heart;

function createRockyGround(){
	rockyGround = new RockyGround();
	// push it a little bit at the bottom of the scene
	rockyGround.mesh.position.y = -500;
	// add the mesh of the rockyGround to the scene
	scene.add(rockyGround.mesh);

  ground = new Ground();
  ground.mesh.position.y = -500;
  scene.add(ground.mesh);

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

var hearts = []; // Array to store the heart objects

function handleLife() {
  // Remove all existing hearts
  for (var i = 0; i < hearts.length; i++) {
    scene.remove(hearts[i].mesh);
  }
  hearts = [];

  // Create a new heart for each life
  for (var i = 0; i < life; i++) {
    var heart = new Heart();
    heart.mesh.position.y = 180;
    heart.mesh.position.z = -100;
    heart.mesh.scale.set(.1, .1, .1);
    heart.mesh.rotation.x = 3;
    heart.mesh.position.x = i * 12 - 24;
    scene.add(heart.mesh);
    hearts.push(heart);
  }
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
        gltf.scene.position.z = -100;
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
  // Move the first rockyGround object
  rockyGround.mesh.position.x -= 3;
  if (rockyGround.mesh.position.x < -window.innerWidth - 1000) {
      rockyGround.mesh.position.x = window.innerWidth / 1;
  }
  // Move the first rockyGround object
  sun.mesh.position.x -= .5;
  if (sun.mesh.position.x < -window.innerWidth ) {
      sun.mesh.position.x = window.innerWidth / 1.5;
  }

  // Move the first rockyGround object
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
            showPlusOne(); // Show the "+1" text
        }
    }

    for (var i = 0; i < malusArray.length; i++) { // Check each malus
        var malusBox = new THREE.Box3().setFromObject(malusArray[i].mesh);

        if (airplaneBox.intersectsBox(malusBox)) {
            life--;
            console.log("Nombre de vie restante: " + life);
            malusArray[i].mesh.position.x = window.innerWidth / 2; // Reset malus position
            malusArray[i].mesh.position.y = Math.random() * 150 + 50; // Random y position between 50 and 200
            console.log('impact');
            console.log(malusBox);
            createParticles(malusBox.min);

            handleLife();

            if (life !== 0) {
              isPushedBack = true;
            }
        }
    }
	if (isPushedBack) {
		PushBack();
	}
  
	if (planeFlying) {
	  // Update the plane on each frame
	  updatePlane();
  }

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
    planeFlying = false;
    deleteMalus();
    deleteBonus();
    crashPlane();

    // Hide play again button on mobile
    var x = window.matchMedia("(max-width: 700px)")
    playButton.textContent = 'CLICK TO PLAY AGAIN';
    playButton.addEventListener('click', startGame);
    if (x.matches) { 
      playButton.style.display = "hidden";
    } else {
      playButton.style.display = 'block';
    }

    infoBox.style.display = 'none';
    modal.style.display = "flex";
    document.getElementById('endScore').textContent = 'You have obtained ' + score + ' Cobalt Points !';
    latestScoreNum = score;
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

function showPlusOne() {
  var p = document.createElement("div");
  p.textContent = "+1";
  p.classList.add("text-3xl","absolute","top-1/2","left-1/2","opacity-0","transition","duration-500");
  document.body.appendChild(p);
  p.style.opacity = 1;

  // Animate the "+1" text to move up and fade out
  setTimeout(function() {
      p.style.opacity = 0;
      p.style.top = '40%';
      p.remove();
  },1000);
}

function crashPlane() {
  airplane.mesh.position.x += 0.6;
  airplane.mesh.position.y -= 1;
	airplane.propeller.rotation.x += 0.1;

  // Smoother transition for the plane rotation
  if (airplane.mesh.rotation.z > -0.4) {
    airplane.mesh.rotation.z -= 0.01;
  }
  if (airplane.mesh.position.x < -window.innerWidth + 500) {
    console.log('Sortie écran gauche');
    airplane.mesh.position.x = 0;
    airplane.mesh.position.y = 100;
    planeFlying = true;
    life = 5;
  }
}

var particlesArray = [];

function createParticles(position) {
  var impactParticles = new Heart();
  impactParticles.mesh.scale.set(.08,.08,.08);
  impactParticles.mesh.position.x = position.x;
  impactParticles.mesh.rotation.x = 3;
  impactParticles.mesh.position.y = position.y;
  scene.add(impactParticles.mesh);
  particlesArray.push(impactParticles);

  setTimeout(function() {
    scene.remove(impactParticles.mesh);
    var index = particlesArray.indexOf(impactParticles);
    if (index > -1) {
      particlesArray.splice(index, 1);
    }
  }, 4000);
}

function animateParticles() {
  requestAnimationFrame(animateParticles);

  particlesArray.forEach(function(impactParticles) {
    impactParticles.mesh.position.y -= 1;
    impactParticles.mesh.rotation.y -= .2;
  });
}

animateParticles();