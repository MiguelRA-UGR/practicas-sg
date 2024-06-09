// Clases de la biblioteca
import * as THREE from './libs/three.module.js';
import { GUI } from './libs/dat.gui.module.js';
import { TrackballControls } from './libs/TrackballControls.js';

// La clase fachada del modelo
class MyScene extends THREE.Scene {
  constructor (myCanvas) { 
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.createLights();
    this.createCamera();
    this.createGround();
    this.axis = new THREE.AxesHelper(3);
    this.add(this.axis);
    
    // Crear esferas con diferentes materiales
    this.createSpheres();
  }
  
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 20000);
    this.camera.position.set(6, 2, 6);
    const look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createGround() {
    const geometryGround = new THREE.BoxGeometry(6, 0.2, 6);
    const texture = new THREE.TextureLoader().load("./wood.jpg");
    const materialGround = new THREE.MeshStandardMaterial({ map: texture });

    const ground = new THREE.Mesh(geometryGround, materialGround);
    ground.position.y = -0.1;
    ground.receiveShadow = true;  // Recibir sombras

    this.add(ground);
}


  createGUI () {
    const gui = new GUI();
    this.guiControls = {
      lightPower: 200.0,
      ambientIntensity: 0.35,
      axisOnOff: true
    };
    const folder = gui.addFolder('Luz y Ejes');
    folder.add(this.guiControls, 'lightPower', 0, 200, 10)
      .name('Luz puntual: ')
      .onChange((value) => this.setLightPower(value));
    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes: ')
      .onChange((value) => this.setAxisVisible(value));
    return gui;
  }
  
  createLights() {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);
    
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.set(0, 5, 0);
    this.spotLight.power = this.guiControls.lightPower;

    this.spotLight.castShadow = true;
    
    // Configurar parámetros de sombras
    this.spotLight.shadow.mapSize.width = 5096;
    this.spotLight.shadow.mapSize.height = 5096;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 50;
    
    this.add(this.spotLight);
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
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
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
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createSpheres() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);

    // Material Lambert
    const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
    const lambertSphere = new THREE.Mesh(geometry, lambertMaterial);
    lambertSphere.position.set(0, 0.5, -2);
    lambertSphere.castShadow = true;
    lambertSphere.receiveShadow = true;
    this.add(lambertSphere);

    const esferaLejana = new THREE.Mesh(geometry, lambertMaterial);
    esferaLejana.position.set(-500, 0.5, -500);
    esferaLejana.castShadow = true;
    esferaLejana.receiveShadow = true;
    this.add(esferaLejana);

    // Material Phong
    const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x572364, shininess: 100 });
    const phongSphere = new THREE.Mesh(geometry, phongMaterial);
    phongSphere.position.set(-2, 0.5, 0);
    phongSphere.castShadow = true;
    phongSphere.receiveShadow = true;
    this.add(phongSphere);

    // Material Físico Transparente
    const physicalMaterialTransparent = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, roughness: 0.2, metalness: 0.8, transmission:1, thickness: 4, ior:1 });
    const transparentSphere = new THREE.Mesh(geometry, physicalMaterialTransparent);
    transparentSphere.position.set(0, 0.5, 2 );
    transparentSphere.castShadow = true;
    transparentSphere.receiveShadow = true;
    this.add(transparentSphere);

    // Material Físico Glossy
    const physicalMaterialGlossy = new THREE.MeshPhysicalMaterial({ color: 0x0000ff, roughness: 0.5, metalness: 0.9 });
    const glossySphere = new THREE.Mesh(geometry, physicalMaterialGlossy);
    glossySphere.position.set(2, 0.5, 0);
    glossySphere.castShadow = true;
    glossySphere.receiveShadow = true;
    this.add(glossySphere);

    // Material Físico Rugoso
    const physicalMaterialRough = new THREE.MeshPhysicalMaterial({ color: 0xff0000, roughness: 0.5, metalness: 0.1});
    const roughSphere = new THREE.Mesh(geometry, physicalMaterialRough);
    roughSphere.position.set(0, 0.5, 0);
    roughSphere.castShadow = true;
    roughSphere.receiveShadow = true;
    this.add(roughSphere);
}


  update () {
    this.renderer.render(this, this.getCamera());
    this.cameraControl.update();
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});
