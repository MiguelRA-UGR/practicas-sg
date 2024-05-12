import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { TWEEN } from '../libs/Tween.js'

import { Escorvispa,TipoEscorvispa } from '../objetos/escorvispa/Escorvispa.js'
import { Coche } from '../objetos/coche/Coche.js'
import { Oruga } from '../objetos/oruga/Oruga.js'

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.initStats();
    this.axis = new THREE.AxesHelper(10);
    this.add(this.axis);
    this.createLights();
    this.createCamera();
    this.createCircuito();
    //this.setAnimation();
    this.cameraIndex = 1;
    this.initKeyboardEvents();

    //Modelos
    this.modelo = new Coche(this.gui, "Coche");
    this.add(this.modelo);

    this.createThirdPersonCamera();
  }

  getPathFromTorusKnot(torusKnot) {
    // La codificación de este método está basado
    //   en el código fuente de la página oficial de Three.js
    // https://github.com/mrdoob/three.js/blob/master/src/geometries/TorusKnotGeometry.js
    const p = torusKnot.parameters.p;
    const q = torusKnot.parameters.q;
    const radius = torusKnot.parameters.radius;
    const resolution = torusKnot.parameters.tubularSegments;
    var u, cu, su, quOverP, cs;
    var x, y, z;
    // En  points  se almacenan los puntos que extraemos del torusKnot
    const points = [];
    for (let i = 0; i < resolution; ++i) {
      u = (i / resolution) * p * Math.PI * 2;
      cu = Math.cos(u);
      su = Math.sin(u);
      quOverP = (q / p) * u;
      cs = Math.cos(quOverP);

      x = radius * (2 + cs) * 0.5 * cu;
      y = radius * (2 + cs) * su * 0.5;
      z = radius * Math.sin(quOverP) * 0.5;

      points.push(new THREE.Vector3(x, y, z));
    }
    // Una vez tenemos el array de puntos 3D construimos y devolvemos el CatmullRomCurve3
    return new THREE.CatmullRomCurve3(points, true);
  }

  initKeyboardEvents() {
    this.adelante = false;
    this.atras = false;
    this.izquierda = false;
    this.derecha = false;
    this.paso = { t: 0, a: 0 };

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowUp":
          this.adelante = true;
          break;
        case "ArrowDown":
          this.atras = true;
          break;
        case "ArrowLeft":
          this.derecha = true;
          break;
        case "ArrowRight":
          this.izquierda = true;
          break;
        case "Space":
          console.log("Cámara cambiada");
          this.toggleCamera();
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "ArrowUp":
          this.adelante = false;
          break;
        case "ArrowDown":
          this.atras = false;
          break;
        case "ArrowLeft":
          this.derecha = false;
          break;
        case "ArrowRight":
          this.izquierda = false;
          break;
      }
    });
  }

  toggleCamera() {
    if (this.cameraIndex === 0) {
      this.cameraIndex = 1;
    } else {
      this.cameraIndex = 0;
    }
  }

  createCircuito() {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load("../imgs/colmena.jpg");
    this.materialColmena = new THREE.MeshBasicMaterial({ map: texture });

    var material = new THREE.MeshStandardMaterial({
      normalMap: texture,
      normalScale: new THREE.Vector2(1, 1),
    });

    this.circuitoTorusGeom = new THREE.TorusKnotGeometry(100, 4, 50, 20, 2, 3);

    this.spline = this.getPathFromTorusKnot(this.circuitoTorusGeom);

    var geometryLine = new THREE.BufferGeometry();

    this.circuitoGeom = new THREE.TubeGeometry(this.spline, 100, 20, 20);
    this.circuito = new THREE.Mesh(this.circuitoGeom, this.materialColmena);

       this.add(this.circuito);

    geometryLine.setFromPoints(this.spline.getPoints(100));
    var material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2,
    });
    var visibleSpline = new THREE.Line(geometryLine, material);

    this.add(visibleSpline);
  }

  setAnimation(){
    this.segmentos = 100;
    this.binormales = this.spline.computeFrenetFrames(
      this.segmentos,
      true
    ).binormals;

    this.origen = { t: 0 };
    var fin = { t: 1 };
    var tiempoDeRecorrido = 40000;

    this.animacion = new TWEEN.Tween(this.origen)
      .to(fin, tiempoDeRecorrido)
      .onUpdate(() => {
        this.posicionAnimacion = this.spline.getPointAt(this.origen.t);
        this.modelo.position.copy(this.posicionAnimacion);
        var tangente = this.spline.getTangentAt(this.origen.t);
        this.posicionAnimacion.add(tangente);
        this.modelo.up =
          this.binormales[Math.floor(this.origen.t * this.segmentos)];
        this.modelo.lookAt(this.posicionAnimacion);
      })
      .repeat(Infinity)
      .start();

  }

  initStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    $("#Stats-output").append(stats.domElement);
    this.stats = stats;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
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

  createThirdPersonCamera() {
    this.thirdPersonCamera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);

    this.modelo.add(this.thirdPersonCamera);

    this.thirdPersonCamera.position.set(0, 1.5, -8);
    var puntoDeMiraRelativo = new THREE.Vector3(0, 0, 0.1);
    var target = new THREE.Vector3();
    this.thirdPersonCamera.getWorldPosition(target);
    target.add(puntoDeMiraRelativo);
    this.thirdPersonCamera.lookAt(target);
    this.add(this.thirdPersonCamera);

    const helper = new THREE.CameraHelper( this.thirdPersonCamera ); 

    const handleResize = () => {
      this.thirdPersonCamera.aspect = window.innerWidth / window.innerHeight;
      this.thirdPersonCamera.updateProjectionMatrix();
    };

  window.addEventListener('resize', handleResize);

    this.add( helper );
  }

  createGUI() {
    var gui = new GUI();
    this.guiControls = {
      lightPower: 500.0,
      ambientIntensity: 1,
      axisOnOff: true,
    };

    var folder = gui.addFolder("Luz y Ejes");
    folder
      .add(this.guiControls, "lightPower", 0, 1000, 20)
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
    this.pointLight = new THREE.PointLight(0xffffff);
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
    renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
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
    
    if (this.cameraIndex === 1) {
      this.cameraControl.update();
      this.modelo.add(this.thirdPersonCamera);
      this.renderer.render(this, this.thirdPersonCamera);
    } else {
      this.cameraControl.update();
      this.renderer.render(this, this.camera);
    }

    if(this.adelante) {
      this.paso.t += 0.001
      this.paso.t %= 1
    } 

    if(this.atras) {
      this.paso.t -= 0.001;
      if (this.paso.t<0) this.paso.t+=1
    }

    if(this.izquierda) {
      this.paso.a += 0.1
      this.paso.a %= 2*Math.PI
    }

    if(this.derecha) {
      this.paso.a -= 0.1
      if (this.paso.a<0) this.paso.a+=2*Math.PI
    }

    this.posicionAnimacion = this.spline.getPointAt(this.paso.t);
    this.modelo.position.copy(this.posicionAnimacion);
    var tangente = this.spline.getTangentAt(this.paso.t);
    this.posicionAnimacion.add(tangente);
    this.modelo.lookAt(this.posicionAnimacion);
    
    this.modelo.update();
    TWEEN.update();
    this.modelo.rotateZ(this.paso.a)
    this.modelo.translateY(this.circuitoGeom.parameters.radius+0.4)
  
    requestAnimationFrame(() => this.update());
  }
  
  
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});