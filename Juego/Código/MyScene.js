// Clases de la biblioteca
import * as THREE from './libs/three.module.js';
import { GUI, color } from './libs/dat.gui.module.js';
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
    this.createSkyBox();
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
    
    this.spotLight = new THREE.DirectionalLight(0xffffff,1);
    this.spotLight.position.set(-5, 10, 0);
    this.spotLight.power = this.guiControls.lightPower;

    // this.spotLight = new THREE.DirectionalLight(0xff8000,1);
    // this.spotLight.position.set(-20, 20, 0);
    // this.spotLight.power = this.guiControls.lightPower;

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

  createSkyBox(){
    //https://redstapler.co/create-3d-world-with-three-js-and-skybox-technique/
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( './imgs/skybox/rainbow_ft.png');
    let texture_bk = new THREE.TextureLoader().load( './imgs/skybox/rainbow_bk.png');
    let texture_up = new THREE.TextureLoader().load( './imgs/skybox/rainbow_up.png');
    let texture_dn = new THREE.TextureLoader().load( './imgs/skybox/rainbow_dn.png');
    let texture_rt = new THREE.TextureLoader().load( './imgs/skybox/rainbow_rt.png');
    let texture_lf = new THREE.TextureLoader().load( './imgs/skybox/rainbow_lf.png');
      
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
    
    this.envMap = new THREE.CubeTextureLoader().load([
      './imgs/skybox/rainbow_ft.png',
      './imgs/skybox/rainbow_bk.png',
      './imgs/skybox/rainbow_up.png',
      './imgs/skybox/rainbow_dn.png',
      './imgs/skybox/rainbow_rt.png',
      './imgs/skybox/rainbow_lf.png'
    ]);

    this.background=this.envMap
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

    //Material Alpha

    const alphaTexture = new THREE.TextureLoader().load("./wire.png");
    const materialAlpha = new THREE.MeshBasicMaterial({
      map: alphaTexture,
      side: THREE.DoubleSide,
      alphaTest:0.5,
    });

    const tumbleweed = new THREE.Mesh(geometry, materialAlpha);
    tumbleweed.position.set(-2, 0.5, 2);
    tumbleweed.castShadow = true;
    tumbleweed.receiveShadow = true;
    this.add(tumbleweed);

    //Material Emisivo
    const matEmisivo = new THREE.MeshStandardMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 1
    });
    const bolaLuz = new THREE.Mesh(geometry, matEmisivo);
    bolaLuz.position.set(-2, 0.5, -2);
    bolaLuz.castShadow = true;
    bolaLuz.receiveShadow = true;
    this.add(bolaLuz);

    //Globo terráqueo
    const mapTexture = new THREE.TextureLoader().load("./globo.png");
    const matMapa = new THREE.MeshBasicMaterial({
      map: mapTexture
    });
    const mapamundi = new THREE.Mesh(geometry, matMapa);
    mapamundi.position.set(2, 0.5, 2);
    mapamundi.castShadow = true;
    mapamundi.receiveShadow = true;
    this.add(mapamundi);
    
    const materialCromado = new THREE.MeshPhysicalMaterial({
      metalness: 1.0,
      roughness: 0.2,
      color: 0xff0000,
      envMap:this.envMap
    });
    const cromo = new THREE.Mesh(geometry, materialCromado);
    cromo.position.set(2, 0.5, -2);
    cromo.castShadow = true;
    cromo.receiveShadow = true;
    this.add(cromo);

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

    // Naranja
    const texture = new THREE.TextureLoader().load("./poros.jpg");
    const naranjaMat = new THREE.MeshStandardMaterial({ color: 0xffa500, roughness:0.3,normalMap: texture, });
    const talloNaranjaMat = new THREE.MeshStandardMaterial({ color: 0x006400, roughness:0.4 });
    const naranja = new THREE.Mesh(geometry, naranjaMat);
    
    var talloGeom = new THREE.CylinderGeometry(0.05,0.1,0.1,8,8);
    var talloNaranja = new THREE.Mesh(talloGeom,talloNaranjaMat )
    
    talloNaranja.position.set(0, 0.5, 0)
    naranja.add(talloNaranja);

    naranja.position.set(2, 0.5, 0);
    naranja.castShadow = true;
    naranja.receiveShadow = true;
    this.add(naranja);

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
