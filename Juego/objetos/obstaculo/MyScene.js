import * as THREE from '../../libs/three.module.js'
import { GUI } from '../../libs/dat.gui.module.js'
import { TrackballControls } from '../../libs/TrackballControls.js'
import { Stats } from '../../libs/stats.module.js'
import { Obstaculo,TipoObstaculo } from './Obstaculo.js'

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.initStats();
    this.axis = new THREE.AxesHelper(5);
    this.add(this.axis);
    this.createLights();
    this.createCamera();

    this.createGround ();

    this.hayObstaculo=false;
  }
  
  initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    $("#Stats-output").append(stats.domElement);
    this.stats = stats;
  }
  
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    this.camera.position.set(4, 2, 4);
    var look = new THREE.Vector3(0,0,0);
    this.camera.lookAt(look);
    this.add(this.camera);
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }
  
  createGround() {
    var geometryGround = new THREE.BoxGeometry(10,0.2,10);
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial({map: texture});
    var ground = new THREE.Mesh(geometryGround, materialGround);
    ground.position.y = -0.1;
    this.add(ground);
  }
  
  createGUI() {
    var gui = new GUI();
    this.guiControls = {
      lightPower: 500.0,
      ambientIntensity: 0.5,
      axisOnOff: true,
      tipoObstaculo: TipoObstaculo.ORUGA // Valor por defecto
    }
    var folder = gui.addFolder('Luz y Ejes');
    folder.add(this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));
    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));
    var folder2 = gui.addFolder('Tipo de obstaculo')
    folder2.add(this.guiControls, 'tipoObstaculo', Object.values(TipoObstaculo))
      .name('Cambiar tipo de Obstaculo')
      .onChange((value) => this.changeObstaculoType(value));
    return gui;
  }

  changeObstaculoType(tipo) {
    this.remove(this.obstaculo);
    this.obstaculo = new Obstaculo(tipo);
    
    this.hayObstaculo=true;

    this.obstaculo.rotateY(THREE.MathUtils.degToRad(90));
    this.add(this.obstaculo);
}
  
  createLights() {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);
    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(2, 3, 1);
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
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
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
    if (this.stats) this.stats.update();
    this.cameraControl.update();

    if(this.hayObstaculo){
      this.obstaculo.update();
    }

    
    this.renderer.render(this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});
