// Find the latest version by visiting https://unpkg.com/three.

import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import {STLLoader} from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js'


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#myCanvas')
  });

let width = window.innerWidth / 2;
let height = window.innerHeight / 2;
renderer.setSize(width ,  height);
//document.body.appendChild( renderer.domElement );

//load STL
const loader = new STLLoader()
let stl_mesh = null;
let load_mesh = false;
loader.load(
    '../TestData/3DBenchy.stl',
    function (geometry) {
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        stl_mesh = new THREE.Mesh(geometry, material)
        scene.add(stl_mesh)
		load_mesh = true;
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    (error) => {
        console.log(error);
    }
);

camera.position.z = 100;

const animate = function () {
	requestAnimationFrame( animate );

	if(load_mesh){
		stl_mesh.rotation.x += 0.01;
		stl_mesh.rotation.y += 0.01;
	}

	renderer.render( scene, camera );
};

animate();