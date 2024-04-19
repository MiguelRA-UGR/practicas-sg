import * as THREE from '../../libs/three.module.js'
import { GUI } from '../../libs/dat.gui.module.js'
import { TrackballControls } from '../../libs/TrackballControls.js'
import { Stats } from '../../libs/stats.module.js'

import { Coche } from './Coche.js'


class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI ();
    this.initStats();
    this.axis = new THREE.AxesHelper (10);
    this.add (this.axis);
    this.createLights ();
    this.createCamera ();

    this.coche = new Coche(this.gui, "Coche");
    this.add(this.coche);
    this.createFixedCamera();

  }
  initStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    $("#Stats-output").append( stats.domElement );
    this.stats = stats;
  }
  
  createFixedCamera() {
    this.fixedCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.fixedCamera.position.set(20, 0, 0);
    this.fixedCamera.lookAt(this.coche.position);
    this.add(this.fixedCamera);
  }

  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (4, 2, 4);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }
  
  createGUI () {
    var gui = new GUI();
    this.guiControls = {
      lightPower : 500.0,
      ambientIntensity : 0.5,   
      axisOnOff : true,
      toggleAnimation: function() {
          if (this.scene.animacion) {
              if (this.scene.animacion.isPlaying()) {
                  this.scene.animacion.pause();
              } else {
                  this.scene.animacion.resume();
              }
          }
      }
    }

    var folder = gui.addFolder ('Luz y Ejes');
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );

    return gui;
}
  
  createLights () {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add (this.ambientLight);
    this.pointLight = new THREE.PointLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    this.add (this.pointLight);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    if (this.stats) this.stats.update();
    this.cameraControl.update();
    this.coche.update();

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});