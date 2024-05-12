import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { TWEEN } from '../libs/Tween.js'

import { Escorvispa,TipoEscorvispa } from '../objetos/escorvispa/Escorvispa.js'
import { Coche } from '../objetos/coche/Coche.js'
import { Orbe ,TipoOrbe} from '../objetos/orbe/Orbe.js'

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
    this.createGround();
    this.colison=false;

    this.initKeyboardEvents();

    this.cocheSpeed = 0;
    this.direction = new THREE.Vector3();
    this.axis = new THREE.Vector3(0, 1, 0);


    this.modelo = new Coche(this.gui, "Coche");
    this.add(this.modelo);

    this.orbe = new Orbe(TipoOrbe.CADENCIA);
    this.add(this.orbe);

    this.orbe.translateZ(10);

    this.createFixedCamera();

    this.cajaModelo = new THREE.Box3();
    this.cajaOrbe = new THREE.Box3();

    var cajaModeloHelper = new THREE.Box3Helper( this.cajaModelo , 0xFFFF00 );
    this.add(cajaModeloHelper);

    var cajaOrbeHelper = new THREE.Box3Helper( this.cajaOrbe , 0xFFFF00 );
    this.add(cajaOrbeHelper);

    this.modelo.add(this.cajaModelo);
    this.modelo.add(this.cajaModeloHelper);
  }

  initKeyboardEvents() {
    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            this.toggleCamera();
        }
    });

    window.addEventListener("keydown", (event) => {
      switch (event.key) {
          case "ArrowUp":
              this.cocheSpeed = 0.1;
              break;
          case "ArrowDown":
              this.cocheSpeed = -0.1;
              break;
      }
  });

  window.addEventListener("keyup", (event) => {
      switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
              this.cocheSpeed = 0;
              break;
      }
  });
  }

  toggleCamera() {
    if (this.camera === this.cameraControl.object) {
        this.camera = this.fixedCamera;
    } else {
        this.camera = this.cameraControl.object;
    }
    this.cameraControl.enabled = !this.cameraControl.enabled;
}

  getPathFromTorusKnot (torusKnot) {
    // La codificación de este método está basado
    //   en el código fuente de la página oficial de Three.js
    // https://github.com/mrdoob/three.js/blob/master/src/geometries/TorusKnotGeometry.js
    const p = torusKnot.parameters.p;
    const q = torusKnot.parameters.q;
    const radius = torusKnot.parameters.radius;
    const resolution = torusKnot.parameters.tubularSegments;
    var u, cu, su, quOverP, cs;
    var x,y,z;
    // En  points  se almacenan los puntos que extraemos del torusKnot
    const points = [];
    for ( let i = 0; i < resolution; ++ i ) {
			u = i / resolution * p * Math.PI * 2;
      cu = Math.cos( u );
			su = Math.sin( u );
			quOverP = q / p * u;
			cs = Math.cos( quOverP );

			x = radius * ( 2 + cs ) * 0.5 * cu;
			y = radius * ( 2 + cs ) * su * 0.5;
			z = radius * Math.sin( quOverP ) * 0.5;

      points.push (new THREE.Vector3 (x,y,z));
    }
    // Una vez tenemos el array de puntos 3D construimos y devolvemos el CatmullRomCurve3
    return new THREE.CatmullRomCurve3 (points, true);
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
    this.fixedCamera.lookAt(this.modelo.position);
    this.add(this.fixedCamera);
  }

//   updateFixedCamera() {
//     const forwardDirection = new THREE.Vector3();
//     this.coche.getWorldDirection(forwardDirection);

//     const offsetDistance = 10;

//     const offset = forwardDirection.clone().multiplyScalar(-offsetDistance);
//     const position = this.coche.position.clone().add(offset);
//     position.y -= 5;
//     this.fixedCamera.position.copy(position);

//     const angle = Math.atan2(forwardDirection.x, forwardDirection.z);

//     this.fixedCamera.rotation.y = angle;

//     this.fixedCamera.lookAt(this.coche.position);
// }

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

    var animationFolder = gui.addFolder('Animación');
    animationFolder.add(this.guiControls, 'toggleAnimation').name('Pausar/Reanudar Animación');

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

  createGround() {
    var geometryGround = new THREE.BoxGeometry(10,0.2,40);
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial({map: texture});
    var ground = new THREE.Mesh(geometryGround, materialGround);
    ground.position.y = -0.1;
    this.add(ground);
  }

  update () {
    if (this.stats) this.stats.update();

    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.modelo.quaternion);
    const velocity = direction.clone().multiplyScalar(this.cocheSpeed);
    this.modelo.position.add(velocity);
    this.orbe.update();

    this.cameraControl.update();
    this.modelo.update();
    this.cajaModelo.setFromObject(this.modelo);
    this.cajaOrbe.setFromObject(this.orbe);

    if(this.cajaModelo.intersectsBox(this.cajaOrbe) && !this.colision){
      console.log("Colisión");
      this.remove(this.orbe);

      this.colision = true;
    }

    TWEEN.update();

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});