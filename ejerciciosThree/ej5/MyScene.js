import { GUI } from '../libs/dat.gui.module.js'
import { Stats } from '../libs/stats.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI ();
    this.initStats();
    this.createLights ();
    this.createCamera ();
    this.createGround ();
    this.axis = new THREE.AxesHelper (3);
    this.add (this.axis);
    this.add (this.model);

    var sphereGeometry1 = new THREE.SphereGeometry(0.5, 32, 32);
    var sphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    sphereMaterial1.flatShading = true;
    var sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
    sphere1.position.set(-1, 1, 3);
    this.add(sphere1);

    var rectanglegeometry = new THREE.BoxGeometry(0.2, 1.5, 1.5);
    var rectanglematerial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    rectanglematerial.flatShading = true;
    var rectangle = new THREE.Mesh(rectanglegeometry, rectanglematerial);
    rectangle.position.set(1, 1, 3);
    this.add(rectangle);

    var rectanglebps = new ThreeBSP(rectangle.geometry);
    var spherebps = new ThreeBSP(sphere1.geometry);

    var agujeromaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    var agujerobps = rectanglebps.subtract(spherebps);
    var agujero = agujerobps.toMesh(agujeromaterial);

    agujero.position.set(0,1,0);
    this.add(agujero);

    agujerobps = rectanglebps.union(spherebps);
    var agujero = agujerobps.toMesh(agujeromaterial);

    agujero.position.set(-2,1,0);
    this.add(agujero);

    agujerobps = rectanglebps.intersect(spherebps);
    var agujero = agujerobps.toMesh(agujeromaterial);

    agujero.position.set(2,1,0);
    this.add(agujero);

    

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
    this.camera.position.set (0, 1.5, 5);
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
      lightPower : 20.0,
      ambientIntensity : 0.5,
      axisOnOff : true
    }
    var folder = gui.addFolder ('Luz y Ejes');
    folder.add (this.guiControls, 'lightPower', 0, 100, 20)
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
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
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

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});
