// Clases de la biblioteca
import * as THREE from './libs/three.module.js';
import { GUI } from './libs/dat.gui.module.js';
import { TrackballControls } from './libs/TrackballControls.js';

// La clase fachada del modelo
class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.createLights();
    this.createCamera();
    //this.createGround();
    this.createSkyBox();
    this.axis = new THREE.AxesHelper(3);
    this.add(this.axis);
    
    this.createModel();

    // Variable para la escala original del brazo
    this.originalArmScaleY = 1;
    this.armScaleSpeed = 0.1;

    // Agregar manejador de eventos de teclado
    window.addEventListener('keydown', (event) => this.onDocumentKeyDown(event));
  }

  createCamera() {
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

  createGUI() {
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
    
    this.spotLight = new THREE.DirectionalLight(0xffffff, 1);
    this.spotLight.position.set(-5, 10, 0);
    this.spotLight.power = this.guiControls.lightPower;

    this.spotLight.castShadow = true;
    
    // Configurar parámetros de sombras
    this.spotLight.shadow.mapSize.width = 5096;
    this.spotLight.shadow.mapSize.height = 5096;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 50;
    
    this.add(this.spotLight);
  }

  setLightPower(valor) {
    this.spotLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible(valor) {
    this.axis.visible = valor;
  }
  
  createRenderer(myCanvas) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

  createSkyBox() {
    //https://redstapler.co/create-3d-world-with-three-js-and-skybox-technique/
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('./imgs/skybox/rainbow_ft.png');
    let texture_bk = new THREE.TextureLoader().load('./imgs/skybox/rainbow_bk.png');
    let texture_up = new THREE.TextureLoader().load('./imgs/skybox/rainbow_up.png');
    let texture_dn = new THREE.TextureLoader().load('./imgs/skybox/rainbow_dn.png');
    let texture_rt = new THREE.TextureLoader().load('./imgs/skybox/rainbow_rt.png');
    let texture_lf = new THREE.TextureLoader().load('./imgs/skybox/rainbow_lf.png');
      
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));
    
    this.envMap = new THREE.CubeTextureLoader().load([
      './imgs/skybox/rainbow_ft.png',
      './imgs/skybox/rainbow_bk.png',
      './imgs/skybox/rainbow_up.png',
      './imgs/skybox/rainbow_dn.png',
      './imgs/skybox/rainbow_rt.png',
      './imgs/skybox/rainbow_lf.png'
    ]);

    this.background = this.envMap;
  }

  createModel() {
    const materialBase = new THREE.MeshNormalMaterial();
    const mapTexture = new THREE.TextureLoader().load("./globo.png");
    const matCabeza = new THREE.MeshBasicMaterial({ map: mapTexture });

    // Cabeza
    var geometry = new THREE.SphereGeometry(
        0.5, 20, 20,
        0, Math.PI * 2, 0, Math.PI / 2
    );

    this.cabeza = new THREE.Mesh(geometry, matCabeza);
    this.cabeza.translateY(0.5);
    this.cabeza.castShadow = true;
    this.cabeza.receiveShadow = true;

    // Cuerpo
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 20, 20);
    this.cuerpo = new THREE.Mesh(geometry, materialBase);
    this.cuerpo.castShadow = true;
    this.cuerpo.receiveShadow = true;
    this.cuerpo.translateY(0.7);
    
    // Brazos
    geometry = new THREE.BoxGeometry(0.3, 1.2, 0.15);
    this.brazo = new THREE.Mesh(geometry, materialBase);
    this.brazo.position.set(0, 0.6, 0.55);

    this.brazo2 = this.brazo.clone();
    this.brazo2.position.set(0, 0.6, -0.55);
    
    this.cuerpo.add(this.cabeza);
    this.add(this.brazo);
    this.add(this.brazo2);
    this.add(this.cuerpo);
  }

  // Manejar eventos de teclado
onDocumentKeyDown(event) {
  const keyCode = event.which;

  if (keyCode === 87) { // 'w' key
    // Aumentar el escalado del brazo
    this.brazo.scale.y += this.armScaleSpeed;
    this.brazo2.scale.y += this.armScaleSpeed;

    // Compensar la traslación en 'y' para mantener la posición
    const armScaleOffset = (this.brazo.scale.y - 1) * 0.6;
    this.brazo.position.y = 0.6 + armScaleOffset;
    this.brazo2.position.y = 0.6 + armScaleOffset;

    // Ajustar la traslación en 'y' del cuerpo en función del escalado del brazo
    const bodyScaleOffset = (this.brazo.scale.y - 1) * 0.3;
    this.cuerpo.position.y = Math.max(0.7 + bodyScaleOffset * 4, 0.7); // Limitar la posición mínima del cuerpo

  } else if (keyCode === 83) { // 's' key
    // Reducir el escalado del brazo
    this.brazo.scale.y -= this.armScaleSpeed;
    this.brazo2.scale.y -= this.armScaleSpeed;

    // Asegurarse de que el escalado no sea menor que el original
    if (this.brazo.scale.y < this.originalArmScaleY) {
      this.brazo.scale.y = this.originalArmScaleY;
      this.brazo2.scale.y = this.originalArmScaleY;
    }

    // Compensar la traslación en 'y' del brazo
    const armScaleOffset = (this.brazo.scale.y - 1) * 0.6;
    this.brazo.position.y = 0.6 + armScaleOffset;
    this.brazo2.position.y = 0.6 + armScaleOffset;

    // Ajustar la traslación en 'y' del cuerpo en función del escalado del brazo
    const bodyScaleOffset = (this.brazo.scale.y - 1) * 0.3;
    this.cuerpo.position.y = Math.max(0.7 + bodyScaleOffset * 4, 0.7); // Limitar la posición mínima del cuerpo
  }
}




  update() {
    this.renderer.render(this, this.getCamera());
    this.cameraControl.update();
    requestAnimationFrame(() => this.update());

    this.cuerpo.translateY(0.3);
    this.cuerpo.rotateZ(0.01);
    this.cuerpo.translateY(-0.3);w

    // Rotar la cabeza
    this.cabeza.rotateY(0.01);
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});

