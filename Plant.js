
import * as THREE from 'three';
import {GUI} from './build/dat.gui.module.js';
import {OrbitControls} from './build/OrbitControls.js';
import {FBXLoader} from './build/FBXLoader.js';
import {NURBSCurve} from './build/NURBSCurve.js';

//==================================
//=======Lindenmayer Plant==========
//==================================

//defaults
let chimneyCanopyBase;
let scene, ratio, camera;
let renderer;

var ambLight, ambLightColour, ambLightInten;
var dirLight, dirLightColour,dirLightInten;
var plantFirstColour, plantSecondColour, plantThirdColour;
var backgroundColour;

let plane;


//const image = new Image();
//image.src = ;

//create the scene
scene = new THREE.Scene();
ratio = window.innerWidth/window.innerHeight;
//create the perspective camera
//for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
//set the camera position
camera.position.set(0,50,50);
// and the direction
camera.lookAt(0,0,0);

//Create the webgl renderer
renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.precision = "highp";
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.powerPreference = "high-performance";
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

//Controls
var controls = new OrbitControls(camera, renderer.domElement );

//========DEBUG===========
initLights();
//loadTestSphere();
loadSkybox();
loadBaseGroundModel();
rules();
//drawLine();
//addTree();
//branchInsert();
renderGui();
animate();
//========================

function loadSkybox(){
  //adding textures 
  //const texture = new THREE.TextureLoader().load(
  //'../Images/Background3JS.jpeg');

  //background texture 
  //scene.background = texture;
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    './images/rwcc/right.png',
    './images/rwcc/left.png',
    './images/rwcc/up.png',
    './images/rwcc/bottom.png',
    './images/rwcc/front.png',
    './images/rwcc/back.png',
  ])
}

function loadTestSphere(){
  const planeGeometry = new THREE.PlaneGeometry(32, 32);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFF,
    side: THREE.DoubleSide
  });

plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
//Plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({color: 0x0000FF, /*texture for sphere */ //map: texture
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
//Sphere.receiveShadow = true;
sphere.position.set(-4,14,-1);

scene.add(sphere);
}



//Lighting
function initLights(){
  ambLight = new THREE.AmbientLight(ambLightColour, ambLightInten);
  scene.add(ambLight);

  dirLight = new THREE.DirectionalLight(dirLightColour, dirLightInten);
  dirLight.position.set(0, 500, 500);
  scene.add(dirLight);
}

//Base Ground Model
function loadBaseGroundModel(){

      const fbXLoader = new FBXLoader();
      fbXLoader.load('./model/chimney_canopy_base.fbx', function(chimneyCanopyBase) {

      chimneyCanopyBase.traverse(function(child){
          if (child.isMesh) 
          {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        } 
      );

      chimneyCanopyBase.scale.setScalar(0.04);
      dirLight.target = chimneyCanopyBase;
      scene.add(chimneyCanopyBase);
    });
}

function branchInsert(totalGeometry, branchLength, branchRadius, topTargetPoint, theta, rho, phi) {

  if (branchLength < 0 || branchRadius < 0)
      return topTargetPoint;

  var branch = new THREE.CylinderGeometry(branchRadius * (1 - radiusReductionFactor), branchRadius, branchLength, 9);

 
  var newTopPoint = new THREE.Vector3(0, branchLength / 2, 0);
  var bottomPoint = new THREE.Vector3(0, - branchLength / 2, 0);

  var branchMesh = new THREE.Mesh(branch);

  branchMesh.autoUpdate = false;

 
  branchMesh.rotateX(toRadians(theta));
  branchMesh.rotateY(toRadians(rho));
  branchMesh.rotateZ(toRadians(phi));

  branchMesh.updateMatrix();

  
  newTopPoint.applyEuler(branchMesh.rotation);
  bottomPoint.applyEuler(branchMesh.rotation);


  newTopPoint.x = newTopPoint.x + topTargetPoint.x - bottomPoint.x;
  newTopPoint.y = newTopPoint.y + topTargetPoint.y - bottomPoint.y;
  newTopPoint.z = newTopPoint.z + topTargetPoint.z - bottomPoint.z;

  branchMesh.position.set(topTargetPoint.x - bottomPoint.x, topTargetPoint.y - bottomPoint.y, topTargetPoint.z - bottomPoint.z);
  branchMesh.updateMatrix();

  if ((branchRadius / initialBranchRadius) < 0.6) {
      let position = [newTopPoint.x, newTopPoint.y, newTopPoint.z, theta + angle, rho + angle, phi + angle];
      leafsPositions.push(position);
      position = [newTopPoint.x, newTopPoint.y, newTopPoint.z, theta - angle, rho - angle, phi - angle];
      leafsPositions.push(position);
  }

  branchMesh.castShadow = true;
  branchMesh.receiveShadow = true;

  totalGeometry.merge(branchMesh.geometry, branchMesh.matrix);

  totalGeometry.castShadow = true;
  totalGeometry.receiveShadow = true;

  return newTopPoint;

}


var axiom = "A";
var sentence = axiom;
var mainRule;


//rules for the algorithm
function rules()  {
 // this.axiom = 'F';
  //this.mainRule = 'FF-[-F+F+F]+[+F+F+F+F+F+F]';
 // this.Rule2 = '';
 var rule1 = {
  a: "A", b: "AB"
 }

 var rule2 = {
  a: "B", b: "A"
 }

 /*function generate()
 {
    for (int i= 0; i < sentence.length; i++)
    {
      var current = sentence.chartAt(i);

    }
    
 }*/

}
//draw a line
function drawLine(x,y, x0,y0, color, width) {
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x0,y0);
  ctx.strokeStyle = color;
  if (params.constantWidth) ctx.lineWidth = 1; else
  ctx.lineWidth = width;
  ctx.stroke();
}

function addTree(x, y) {
  var material = new THREE.LineBasicMaterial({ color: 0xaaa });
  var line_geometry = new THREE.Geometry();
  line_geometry = DrawTheTree(line_geometry, x, y, 0);
}


//Dat GUI
function renderGui()
{
  const gui = new GUI();

  //parameters for GUI
  //Test sphere
  let options = {
    sphereColor: '#ffea00',
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
  }


//colour variables
  let col = {
    ambLightColour: 0xe52b50,  //dark pink - Amaranth shade
    ambLightInten: 0.05,
    dirLightColour: 0xfd8535, //orange - Coral shade
    dirLightInten: 0.05,
    plantFirstColour: 0xffffff, //white
    plantSecondColour: 0xffffff, //white
    plantThirdColour: 0xffffff //white
  }


  let colourFolder = gui.addFolder("Scene Colour Management");

  let ambLightFolder = colourFolder.addFolder("Ambient Light Control");
  ambLightFolder.addColor(col, "ambLightColour").name("AL Colour").onChange(() => 
  {
      ambLight.color.setHex(col.ambLightColour);
  });
  ambLightFolder.add(col, "ambLightInten", 0, 10, 0.005).name("AL Intensity").onChange(() =>
  {
      ambLight.intensity = col.ambLightInten;
  });

  //scene colour change
  let dirLightFolder = colourFolder.addFolder("Directional Light Control");
  dirLightFolder.addColor(col, "dirLightColour").name("Directional Light").onChange(() => 
  {
    dirLight.color.setHex(col.dirLightColour);
  })
  dirLightFolder.add(col, "dirLightInten", 0, 1, 0.005).name("Dir Light Intensity").onChange(() => 
  {
    dirLight.intensity.set(col.dirLightInten);
  })
  //colourFolder.addColor(col, "ambLightColour").name("Ambient Light").onChange(() => 
  //{
    //ambLight.color.set(col.ambLightColour);
  //})
  //colourFolder.add(col, "ambLightColour", 0, 1, 0.005).name("AL Intensity");

  //colourFolder.add(mesh.rotation, "y", 0, Math.PI * 2, 0.001).name("Secondary Clour");
  //colourFolder.add(mesh.rotation, "z", 0, Math.PI * 2, 0.001).name("Accent Colour");
  //colourFolder.add(mesh.rotation, "z", 0, Math.PI * 2, 0.001).name("Regenerate");

  //let SphereFolder = gui.addFolder("Sphere Management");
  //SphereFolder.addColor(options, 'sphereColor').onChange(function(e){
    //Sphere.material.color.set(e)
  //});

  //below three gui options are for the light
  let lightFolder = gui.addFolder("Light Attributes Management");
  lightFolder.add(options, 'angle', 0, 1)
  lightFolder.add(options, 'penumbra', 0, 1)
  lightFolder.add(options, 'intensity', 0, 1)
}

function animate(){
  requestAnimationFrame(animate);
  render();
  //mesh.geometry.attributes.position.needsUpdate = true;
  //dirLight.angle = options.angle;
  //dirLight.angle = options.angle;
  //dirLight.intensity = options.intensity;
  let increment = 0.001;
  //scene.rotation.x += increment;
  scene.rotation.y += increment;
  //mesh.rotation.z += increment;
  controls.update();

}

function render() 
{
    //controls.update(clock.getDelta());
    //scene.clear();
    renderer.render(scene,camera);
}

