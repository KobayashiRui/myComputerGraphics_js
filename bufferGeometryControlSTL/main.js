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

let load_mesh = false;
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

camera.position.z = 100;

const animate = function () {
	requestAnimationFrame( animate );

	//if(load_mesh){
	//	stl_mesh.rotation.x += 0.01;
	//	stl_mesh.rotation.y += 0.01;
	//}

	renderer.render( scene, camera );
};

animate();

// file input button
document.getElementById('pickFile').addEventListener('change', openFile, false);

// file load
// TODO キャンセルへの対応
function openFile (evt) {

    let fileObject = evt.target.files[0];
    if(fileObject === undefined){
      return
    }

    // delete previous objects from scene 
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    let reader = new FileReader();
    reader.onload = function ()
    {
        let loader = new STLLoader();
        let geometry = loader.parse(this.result);
        console.log(geometry.getAttribute('position'));
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        load_mesh = true;
    };
    // --> update here 
    reader.readAsArrayBuffer(fileObject);
};