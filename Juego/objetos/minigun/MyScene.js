import * as THREE from '../../libs/three.module.js'
import { GUI } from '../../libs/dat.gui.module.js'
import { TrackballControls } from '../../libs/TrackballControls.js'
import { Minigun } from './Minigun.js'

class MyScene extends THREE.Scene {
  constructor(myCanvas) { 
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.createLights();
    this.createCamera();
    this.axis = new THREE.AxesHelper(3);
    this.add(this.axis);
    this.model = new Minigun(this.gui, "Controles Minigun");
    this.model.scale.set(0.3,0.3,0.3);
    this.add(this.model);
  }
  
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.camera.position.set (4, 2, 4);
    var look = new THREE.Vector3(0,0,0);
    this.camera.lookAt(look);
    this.add(this.camera);
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }
  
  createGUI() {
    var gui = new GUI();
    this.guiControls = {
      lightPower: 100.0,
      ambientIntensity: 0.35,
      axisOnOff: true
    }
    var folder = gui.addFolder('Luz y Ejes');
    folder.add(this.guiControls, 'lightPower', 0, 200, 10)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));
    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));
    return gui;
  }
  
  createLights() {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);
    this.pointLight = new THREE.SpotLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    this.add(this.pointLight);
  }
  
  setLightPower(valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible(valor) {
    this.axis.visible = valor;
  }
  
  createRenderer(myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;  
  }
  
  getCamera() {
    return this.camera;
  }
  
  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
    
  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    this.renderer.render(this, this.getCamera());
    this.cameraControl.update();
    this.model.update();
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});
