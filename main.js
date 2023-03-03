import * as THREE from 'three';
import "./style.css"
import { gsap } from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


// //Image assets
// import imgUrl from '/images/bg1.png'
// document.getElementById('hero-img').src = imgUrl

//Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0x000000)

//Create object
const geometry = new THREE.SphereGeometry(.2,10,10)
const material = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity:1,
  color:'#00ff83',
})

const Icon1 = new THREE.Mesh(geometry, material)
Icon1.position.set(2.5,6,-5)
Icon1.userData.name = 'Icon1'
scene.add(Icon1)

const Icon2 = new THREE.Mesh(geometry, material)
Icon2.position.set(-5,5,0)
Icon2.userData.name = 'Icon2'
scene.add(Icon2)


 // CSS2DObject 
 const label1Div = document.createElement( 'div' )
 label1Div.className = 'label'
 label1Div.textContent = 'Spot 1'
 const Label1 = new CSS2DObject( label1Div)
 Icon1.add( Label1 );

 const label2Div = document.createElement( 'div' )
 label2Div.className = 'label'
 label2Div.textContent = 'Spot 2'
 const Label2 = new CSS2DObject( label2Div)
 Icon2.add( Label2 );



//GLTF Loader 
const loader = new GLTFLoader()
loader.load('/gltf/scene.gltf', function(gltf){
  console.log(gltf)
  scene.add( gltf.scene);
  const model = gltf.scene;
  model.rotation.y += -1.5;
  model.position.y = -2;
}, function(xhr){
  console.log((xhr.loader/xhr.total * 100)+ "% loaded")
}, function(error){
  console.log('An error occured')
})


//Helper
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

// const plane = new THREE.Plane( new THREE.Vector3( 0, 90, 0 ), 0 );
// const planeHelper = new THREE.PlaneHelper( plane, 30, 0xffff00 );
// scene.add( planeHelper );






 
 Icon1.add( Label1 );
//  testLabel.position.x = 5200;
//  testLabel.position.y = 900;
//  testLabel.position.z = 0;

 const labelRenderer = new CSS2DRenderer()
 labelRenderer.setSize( window.innerWidth, window.innerHeight )
 labelRenderer.domElement.style.position = 'absolute'
 labelRenderer.domElement.style.top = '0px'
 labelRenderer.domElement.style.pointerEvents = 'none'
 document.body.appendChild( labelRenderer.domElement )


//Mouse interact
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove( event ) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener( 'pointer', onPointerMove );
window.addEventListener( 'click', function(e) {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children, false)
  if ( intersects.length > 0 ) {
    if (intersects[0].object.userData.name === 'Icon1') {
      console.log('Icon1')
      const tl = gsap.timeline()
      // tl.fromTo(Icon1.scale, 1, {z:0,x:0,y:0},{z:1, x:1, y:1})
      tl.to(controls.target, 1, {x:4, y:3, z:1})
      tl.to(camera.position, 1, {x:6.28927442571465, y:3.9949159995306895, z:5.5065169909856895},'-=1')
    }

    if (intersects[0].object.userData.name === 'Icon2') {
      console.log('Icon2')
      const tl = gsap.timeline()
      // tl.fromTo(Icon1.scale, 1, {z:0,x:0,y:0},{z:1, x:1, y:1})
      tl.to(controls.target, 1, {x:0, y:0, z:0})
      tl.to(camera.position, 1, {x:0, y:16, z:24},'-=1')
    }
} 

  renderer.render( scene, camera );
});

window.addEventListener( 'pointermove', onPointerMove );

//Sizes
const sizes = { 
  width: window.innerWidth,
  height: window.innerHeight,
} 

//Light
const ambient = new THREE.AmbientLight( 0x404040, 2); // soft white light
scene.add(ambient)
const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
directionalLight.position.set(10,45,10)

      //Light Helper
      // const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
      // scene.add( directionalLightHelper );

scene.add( directionalLight );
// const plight = new THREE.PointLight(0xffffff, 1, 100)
// plight.position.set(10,10,10)
// scene.add(plight)


//Camera
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height, 0.1, 100)
camera.position.y = 16
camera.position.z = 24
scene.add(camera)

// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGL1Renderer({canvas, antialias:true, alpha:true})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = true
controls.maxPolarAngle = Math.PI /2
controls.enableZoom = true
controls.autoRotate = false
controls.autoRotateSpeed = 5
// controls.addEventListener( "change", event => {  
//   console.log( controls.object.position );
// })


//Resize
window.addEventListener('resize', () => {
  //update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  labelRenderer.setSize( window.innerWidth, window.innerHeight );
})

const loop = () => {
  controls.update()
  labelRenderer.render( scene, camera )
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

animate()

loop()

function animate(){
  requestAnimationFrame(animate)

}





//Timeline magic
// const tl = gsap.timeline()
// tl.fromTo(mesh.scale, 1, {z:0,x:0,y:0},{z:1, x:1, y:1})
// tl.to(controls.target, 1, {x:0, y:5, z:0})