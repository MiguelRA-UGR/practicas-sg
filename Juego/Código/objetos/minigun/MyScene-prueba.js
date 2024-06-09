import * as THREE from "../../libs/three.module.js";
import { GUI } from "../../libs/dat.gui.module.js";
import { TrackballControls } from "../../libs/TrackballControls.js";
import { Minigun } from "./Minigun.js";
import { Bala } from '../bala/Bala-fisica.js'
import { Physijs } from "../../libs/physi.module.js";

Physijs.scripts.ammo = './ammo.js';
Physijs.scripts.worker = './physijs_worker.js';

class MyPhisiScene extends Physijs.Scene {
  constructor(myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    this.setGravity (new THREE. Vector3 (0 ,-10, 0) ) ;
    this.gui = this.createGUI();
    this.initMouseEvents();
    this.createLights();
    this.createCamera();
    this.createGround();
    this.axis = new THREE.AxesHelper(3);
    this.add(this.axis);
    this.model = new Minigun(this.gui, "Controles Minigun");
    this.model.scale.set(0.3, 0.3, 0.3);
    this.model.position.set(0, 1, 0);
    this.add(this.model);
  }
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.camera.position.set(4, 2, 4);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);
    this.cameraControl = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createGround() {
    var geometryGround = new THREE.BoxGeometry(10, 0.2, 10);

    var texture = new THREE.TextureLoader().load("../imgs/wood.jpg");
    var materialGround = new THREE.MeshStandardMaterial({ map: texture });

    var ground = new Physijs.BoxMesh(geometryGround, materialGround, 0);

    ground.position.y = -0.1;

    this.add(ground);
  }

  initMouseEvents() {
    window.addEventListener("mousedown", (event) => {
      if (event.button === 2) {
        this.model.guiControls.rotandoPlato = true;
      }
    });

    window.addEventListener("mouseup", (event) => {
      if (event.button === 2) {
        this.model.guiControls.rotandoPlato = false;
      }
    });

    window.addEventListener("mousedown", (event) => {
      if (this.model.guiControls.rotandoPlato && event.button === 0) {
        this.model.disparar(true);
        this.createCasquillo();
      }
    });
  }

  createCasquillo() {

    this.materialCasquillo = new THREE.MeshPhysicalMaterial({
      color: 0xCDA434,
      roughness: 0.1,
      metalness: 0.75,
    });

    this.matFisico = Physijs.createMaterial ( this.materialCasquillo , 1 ,1 ) ;

    const cilindroGeom = new THREE.CylinderGeometry(0.25, 0.25, 1, 10);
    const casquillo = new Physijs.CylinderMesh(cilindroGeom, this.matFisico,1);


    casquillo.scale.set(0.2, 0.2, 0.2);
    casquillo.position.set(0, 1, -0.3);
    casquillo.rotateZ(THREE.MathUtils.degToRad(90));
    
    casquillo.__dirtyPosition = true;
    casquillo.__dirtyRotation = true;

    this.add(casquillo);

    const direction = new THREE.Vector3(Math.random(), Math.random(), -1).normalize();
    const fuerza = Math.random();

    const effect = direction.multiplyScalar(fuerza);
    casquillo.applyCentralImpulse(effect);
    
    setTimeout(() => {
      this.remove(casquillo);
    }, 2000);
}


  createGUI() {
    var gui = new GUI();
    this.guiControls = {
      lightPower: 100.0,
      ambientIntensity: 0.5,
      axisOnOff: true,
    };
    var folder = gui.addFolder("Luz y Ejes");
    folder
      .add(this.guiControls, "lightPower", 0, 200, 10)
      .name("Luz puntual : ")
      .onChange((value) => this.setLightPower(value));
    folder
      .add(this.guiControls, "ambientIntensity", 0, 1, 0.05)
      .name("Luz ambiental: ")
      .onChange((value) => this.setAmbientIntensity(value));
    folder
      .add(this.guiControls, "axisOnOff")
      .name("Mostrar ejes : ")
      .onChange((value) => this.setAxisVisible(value));
    return gui;
  }

  createLights() {
    this.ambientLight = new THREE.AmbientLight(
      "white",
      this.guiControls.ambientIntensity
    );
    this.add(this.ambientLight);
    this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(0, 5, 0);
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
    renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0);
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
    this.simulate();
    this.renderer.render(this, this.getCamera());
    this.cameraControl.update();
    this.model.update();
    requestAnimationFrame(() => this.update());
  }
}

$(function () {
  var scene = new MyPhisiScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});
