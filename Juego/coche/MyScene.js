import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

import { Escorvispa } from '../escorvispa/Escorvispa.js'
import { Coche } from './Coche.js'
import { Motor } from './Motor.js'
import { Minigun } from './Minigun.js'
import { Orbe,TipoOrbe } from './Orbe.js'
import { Bala } from './Bala.js'

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
    //this.createGround ();

    //Modelos
  ////////////////////////////////////////////////////////////////////
    /*
    this.escorvispa = new Escorvispa(this.gui, "Escorvispa");
    this.escorvispa.position.set(2.8,0,0);
    this.escorvispa.scale.set(0.5,0.5,0.5);
    this.add(this.escorvispa);
    */
   //////////////////////////////////////////////////////////////////
    ///*
    this.coche = new Coche(this.gui, "Coche");
    //this.coche.rotateY(THREE.MathUtils.degToRad(180));
    this.add(this.coche);
    //*/
  ////////////////////////////////////////////////////////////////////
    /*
    this.minigun = new Minigun(this.gui, "Minigun")
    this.add(this.minigun);
    */
  ////////////////////////////////////////////////////////////////////
    /*
    this.paredGeom = new THREE.BoxGeometry(5,2,0.2);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.pared = new THREE.Mesh(this.paredGeom,material);
    this.pared.position.set(0,1,5);
    this.add(this.pared);
    */
  ////////////////////////////////////////////////////////////////////
    this.orbe1 = new Orbe(TipoOrbe.CADENCIA);
    //this.add(this.orbe1);
  ////////////////////////////////////////////////////////////////////
    this.bala = new Bala();
    this.bala.position.set(2,0,0);
    //this.add(this.bala);

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
  
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
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
  
  createGround () {
    var geometryGround = new THREE.BoxGeometry (10,0.2,10);
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial ({map: texture});
    var ground = new THREE.Mesh (geometryGround, materialGround);
    ground.position.y = -0.1;
    this.add (ground);
  }
  
  createGUI () {
    var gui = new GUI();
    this.guiControls = {
      lightPower : 500.0,
      ambientIntensity : 0.5,   
      axisOnOff : true
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
    //this.escorvispa.update();
    this.coche.update();
    //this.minigun.update();

    this.orbe1.update();

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});
