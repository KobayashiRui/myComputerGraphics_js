// Find the latest version by visiting https://unpkg.com/three.

//import * as THREE from 'https://unpkg.com/three/build/three.module.js';
//import {STLLoader} from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js'
import * as THREE from '../three.js-master/build/three.module.js';
import {STLLoader} from '../three.js-master/examples/jsm/loaders/STLLoader.js';


class Point {
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Polyline {
  constructor(p1, p2){
    this.p1 = p1;
    this.p2 = p2;
  }
}

class Triangle {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.reArrangeZPos();
    //this.checkCase(0.0);
    //let polyline = this.slice(0.1);
    //console.log(polyline);
  }
  reArrangeZPos(){
    if(this.p1.z >= this.p2.z && this.p1.z >= this.p3.z){
      this.z_max = this.p1;
      if(this.p2.z >= this.p3.z){
        this.z_mid = this.p2;
        this.z_min = this.p3;
      }else{
        this.z_mid = this.p3;
        this.z_min = this.p2;
      }
    }else if(this.p2.z >= this.p1.z && this.p2.z >= this.p3.z){
      this.z_max = this.p2;
      if(this.p1.z >= this.p3.z){
        this.z_mid = this.p1;
        this.z_min = this.p3;
      }else{
        this.z_mid = this.p3;
        this.z_min = this.p1;
      }
    }else if(this.p3.z >= this.p1.z && this.p3.z >= this.p2.z){
      this.z_max = this.p3;
      if(this.p1.z >= this.p2.z){
        this.z_mid = this.p1;
        this.z_min = this.p2;
      }else{
        this.z_mid = this.p2;
        this.z_min = this.p1;
      }
    }
  }
  checkCase(z_p){
    //case6
    if(z_p > this.z_max.z || z_p < this.z_min.z){
      //pass 
      this.case = 6;
    //case5
    }else if(z_p == this.z_max.z && z_p == this.z_min.z){
      //pass
      this.case = 5;
    //case3_1
    }else if(z_p == this.z_max.z && z_p == this.z_mid.z){
      this.case = 3.1;
    //case3_2
    }else if(z_p == this.z_min.z && z_p == this.z_mid.z){
      this.case = 3.2;
    //case4
    }else if(z_p == this.z_max.z || z_p == this.z_min.z){
      //pass
      this.case = 4;
    //case2
    }else if(z_p == this.z_mid.z){
      this.case = 2;
    //case1_1
    }else if(z_p > this.z_mid.z){
    
      this.case = 1.1;
    //case1_2
    }else if(z_p < this.z_mid.z){

      this.case = 1.2;
    }else{
      console.log("Error");
    }
  }
  sliceTriangle(z_p){
    //case6
    if(z_p > this.z_max.z || z_p < this.z_min.z){
      //pass 
      this.case = 6;
      return null;
    //case5
    }else if(z_p == this.z_max.z && z_p == this.z_min.z){
      //pass
      this.case = 5;
      return null;
    //case3_1 : 
    }else if(z_p == this.z_max.z && z_p == this.z_mid.z){
      this.case = 3.1;
      return new Polyline(this.z_max, this.z_mid);
    //case3_2
    }else if(z_p == this.z_min.z && z_p == this.z_mid.z){
      this.case = 3.2;
      return new Polyline(this.z_min, this.z_mid);
    //case4
    }else if(z_p == this.z_max.z || z_p == this.z_min.z){
      //pass
      this.case = 4;
      return null;
    //case2
    }else if(z_p == this.z_mid.z){
      this.case = 2;
      //p = p1 + t *(p2 - p1)
      //p_x = p1_x + t *(p2_x - p1_x)
      //p_y = p1_y + t *(p2_y - p1_y)
      //p_z = z_p
      //t = (z_p - p1_z) / (p2_z - p1_z) //z_p is slice plane z axis value
      let _t1 = (z_p - this.z_min.z) / (this.z_max.z - this.z_min.z) 
      let _p1_x = this.z_min.x + _t1*(this.z_max.x - this.z_min.x);
      let _p1_y = this.z_min.y + _t1*(this.z_max.y - this.z_min.y);
      let _p1_z = z_p;

      return new Polyline(new Point(_p1_x, _p1_y, _p1_z), this.z_mid);
    //case1_1
    }else if(z_p > this.z_mid.z){
      //max-mid & max-min
      this.case = 1.1;
      //calc max-mid
      let _t1 = (z_p - this.z_mid.z) / (this.z_max.z - this.z_mid.z) 
      let _p1_x = this.z_mid.x + _t1*(this.z_max.x - this.z_mid.x);
      let _p1_y = this.z_mid.y + _t1*(this.z_max.y - this.z_mid.y);
      let _p1_z = z_p;


      let _t2 = (z_p - this.z_min.z) / (this.z_max.z - this.z_min.z) 
      let _p2_x = this.z_min.x + _t2*(this.z_max.x - this.z_min.x);
      let _p2_y = this.z_min.y + _t2*(this.z_max.y - this.z_min.y);
      let _p2_z = z_p;

      return new Polyline(new Point(_p1_x, _p1_y, _p1_z), new Point(_p2_x, _p2_y, _p2_z));
    //case1_2
    }else if(z_p < this.z_mid.z){
      //mid-min & max-min
      this.case = 1.2;

      let _t1 = (z_p - this.z_mid.z) / (this.z_min.z - this.z_mid.z) 
      let _p1_x = this.z_mid.x + _t1*(this.z_min.x - this.z_mid.x);
      let _p1_y = this.z_mid.y + _t1*(this.z_min.y - this.z_mid.y);
      let _p1_z = z_p;

      let _t2 = (z_p - this.z_min.z) / (this.z_max.z - this.z_min.z) 
      let _p2_x = this.z_min.x + _t2*(this.z_max.x - this.z_min.x);
      let _p2_y = this.z_min.y + _t2*(this.z_max.y - this.z_min.y);
      let _p2_z = z_p;

      return new Polyline(new Point(_p1_x, _p1_y, _p1_z), new Point(_p2_x, _p2_y, _p2_z));
    }else{
      console.log("Error");
    }
  }
}



class Polygon {
  constructor(){
    this.trainagles = [];
    this.line_seguments_list = [];
  }
  addTriangle(triangle){
    this.trainagles.push(triangle);
  }
  clearTriangles(){
    this.trainagles = [];
  }
  bufferAttributeToPolygon(buffer_attribute){
    for(let i=0; i < (buffer_attribute.count/3); i++){
      let _x1 = buffer_attribute.array[i*9];
      let _y1 = buffer_attribute.array[(i*9)+1];
      let _z1 = buffer_attribute.array[(i*9)+2];
      let _point1 = new Point(_x1, _y1, _z1); 

      let _x2 = buffer_attribute.array[(i*9)+3];
      let _y2 = buffer_attribute.array[(i*9)+4];
      let _z2 = buffer_attribute.array[(i*9)+5];
      let _point2 = new Point(_x2, _y2, _z2); 

      let _x3 = buffer_attribute.array[(i*9)+6];
      let _y3 = buffer_attribute.array[(i*9)+7];
      let _z3 = buffer_attribute.array[(i*9)+8];
      let _point3 = new Point(_x3, _y3, _z3); 

      this.addTriangle(new Triangle(_point1, _point2, _point3))
    }
  }
  slice(z_p){
    let line_seguments  = [];
    console.log(this.trainagles)
    for(let triangle of this.trainagles){
      let result = triangle.sliceTriangle(z_p);
      if(result != null){
        line_seguments.push(result);
      }
    }
    this.line_seguments_list.push(line_seguments);
  }
  slicing(){
    const max_z = 10;
    const layer = 0.1;
    for(let i=0; i < max_z; i++){
      this.slice(i*layer);
    }
  }
}


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
	renderer.render( scene, camera );
};

const polygon = new Polygon();

animate();

// file input button
document.getElementById('pickFile').addEventListener('change', openFile, false);

document.getElementById('startSlice').addEventListener('click', startSlicing, false);

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
        polygon.clearTriangles();
        polygon.bufferAttributeToPolygon(geometry.getAttribute('position'));
        console.log(polygon.trainagles)
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        load_mesh = true;
    };
    // --> update here 
    reader.readAsArrayBuffer(fileObject);
};

function startSlicing(){
  if(!load_mesh){
    alert("not loading stl");
    return ;
  }

  polygon.slicing();
  console.log(polygon);
}