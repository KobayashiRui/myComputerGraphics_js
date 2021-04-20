import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#myCanvas')
  });

let width = window.innerWidth / 2;
let height = window.innerHeight / 2;
renderer.setSize(width , height);

camera.position.z = 5;

renderer.render( scene, camera );