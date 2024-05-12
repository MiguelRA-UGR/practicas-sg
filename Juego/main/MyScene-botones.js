import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { TWEEN } from '../libs/Tween.js'

import { Coche } from '../objetos/coche/Coche.js'
import { Orbe, TipoOrbe } from '../objetos/orbe/Orbe.js'

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.initStats();
    this.createLights();
    this.createCamera();
    this.createCircuito();
    this.createSkyBox();
    this.cameraIndex = 1;
    this.initKeyboardEvents();

    //Velocidades
    this.velocidadCoche = 0.0004;
    this.velocidadLateral = 0.01;
    this.velocidadDisparo=0;

    //Control de Juego
    this.finJuego =false;
    this.puntuacion=0;
    this.vueltas=0;
    this.almacenadoInicio=false;
    this.bonicacionEnCurso=false;
    this.iniciadaBonificacion=false;
    this.colisiondetectada=false;
    this.puntoInicio = new THREE.Vector3();
    this.bonificacionActiva = "Ninguna";

    //Bonificadores
    this.bonificadorCadencia=1;
    this.bonificadorVelocidad=1;
    this.bonificadorTamaño=1;
    this.bonificadorVueltas=1;
    this.bonificadorDanio=1;

    //Tiempos
    this.TiempoRestante = 120000; //2 minutos
    this.tiempoEfecto=10000 //10s
    this.inicio = new Date(); //Momento de inicio
    this.inicioBonificacion = new Date();
    this.tiempoTranscurridoBonif=0;
    this.tiempoTranscurrido=0;

    //Modelos
    this.modelo = new Coche(this.gui, "Coche");
    this.add(this.modelo);

    //Hitbox
    this.hitBoxCoche = new THREE.Box3();
    var hitBoxHelper = new THREE.Box3Helper( this.hitBoxCoche , 0x000000 );
    this.add(hitBoxHelper);

    this.createThirdPersonCamera();

    this.createOrbes();
  }

  completarVuelta(){
    //10% más rápido cada vuelta;
    this.bonificadorVueltas+=0.1;
    this.vueltas+=1;
  }

  aplicarBonificacion( tipo){

    this.bonificacionActiva=tipo;
    this.iniciadaBonificacion=true;
    switch(tipo){
      case TipoOrbe.CADENCIA:
        //+25% cadencia durante 10 segundos
        this.bonificadorCadencia=2;
        break;
      case TipoOrbe.TIEMPO_RALENTIZADO:
        // +5s
        this.TiempoRestante+=5000;
        break;
      case TipoOrbe.VELOCIDAD_AUMENTADA:
        // +25% velocidad durante 10 segundos
        this.bonificadorVelocidad=1.25;
        break;
      case TipoOrbe.TAMAÑO_AUMENTADO:
        // x2 de tamaño durante 10 segundos
        this.bonificadorTamaño=2;
        break;
      case TipoOrbe.DAÑO_AUMENTADO:
        // X2 de daño
        this.bonificadorDanio=2;
        break;
      case TipoOrbe.REPARAR:
        // Eliminar efecto malo
        this.efectoEnCurso=false;
        this.bonificacionActiva="Ninguna";
        break;
    }
  }

  reset(){
    this.bonificadorCadencia=1;
    this.bonificadorVelocidad=1;
    this.bonificadorTamaño=1;
    this.bonificadorDanio=1;

    this.tiempoTranscurridoBonif=0;
    this.iniciadaBonificacion=false;
  }

  createSkyBox(){
    //https://redstapler.co/create-3d-world-with-three-js-and-skybox-technique/
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( '../imgs/skybox/rainbow_ft.png');
    let texture_bk = new THREE.TextureLoader().load( '../imgs/skybox/rainbow_bk.png');
    let texture_up = new THREE.TextureLoader().load( '../imgs/skybox/rainbow_up.png');
    let texture_dn = new THREE.TextureLoader().load( '../imgs/skybox/rainbow_dn.png');
    let texture_rt = new THREE.TextureLoader().load( '../imgs/skybox/rainbow_rt.png');
    let texture_lf = new THREE.TextureLoader().load( '../imgs/skybox/rainbow_lf.png');
      
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
      
    for (let i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;
      
    let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );
    this.add( skybox );
  }

  createOrbes() {
    // Número de orbes que deseas generar
    const numOrbes = 20;
  
    const points = this.spline.getPoints(numOrbes);
    this.orbes = [];
    
    for (let i = 0; i < numOrbes; i++) {
      
      const orbe = new Orbe();
      orbe.position.x = points[i].x;
      orbe.position.y = points[i].y + 23  ;
      orbe.position.z = points[i].z;
      this.orbes.push(orbe);
      this.add(orbe);
    }
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
    this.adelante = true;
    this.izquierda = false;
    this.derecha = false;
    this.paso = { t: 0, a: 0 };

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
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
      15000
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
    this.thirdPersonCamera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,15000);

    this.modelo.add(this.thirdPersonCamera);

    this.thirdPersonCamera.position.set(0, 1.5, -8);
    var puntoDeMiraRelativo = new THREE.Vector3(0, 0, 0.1);
    var target = new THREE.Vector3();
    this.thirdPersonCamera.getWorldPosition(target);
    target.add(puntoDeMiraRelativo);
    this.thirdPersonCamera.lookAt(target);
    this.add(this.thirdPersonCamera);

    const handleResize = () => {
      this.thirdPersonCamera.aspect = window.innerWidth / window.innerHeight;
      this.thirdPersonCamera.updateProjectionMatrix();
    };

  window.addEventListener('resize', handleResize);

  }

  updateGUI() {
    this.guiControls.tiempoRestante = "" + parseInt((this.TiempoRestante - this.tiempoTranscurrido) / 1000) + " s";
    this.guiControls.vueltasRealizadas = "" + this.vueltas;
    this.guiControls.puntos = "" + this.puntuacion;
    this.guiControls.bonificacion = this.bonificacionActiva;
    
    this.gui.updateDisplay();
}

  createGUI() {
    var gui = new GUI();
    this.guiControls = {
      lightPower: 500.0,
      ambientIntensity: 1,
      axisOnOff: true,
      tiempoRestante: "" + (this.TiempoRestante / 1000) + " s",
      vueltasRealizadas: "" + this.vueltas,
      puntos: "" + this.puntuacion,
      bonificacion: "Ninguna"
    };

    gui.add(this.guiControls, "tiempoRestante").name("Tiempo Restante");
    gui.add(this.guiControls, "vueltasRealizadas").name("Vueltas Realizadas");
    gui.add(this.guiControls, "puntos").name("Puntos");
    gui.add(this.guiControls, "bonificacion").name("Bonificacion Activa");
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

    if(!this.finJuego){
       //Movimiento por el tubo
      if(this.adelante) {
        this.paso.t += this.velocidadCoche*this.bonificadorVelocidad*this.bonificadorVueltas;
        this.paso.t %= 1
      } 

      if(this.izquierda) {
        this.paso.a += this.velocidadLateral
        this.paso.a %= 2*Math.PI
      }

      if(this.derecha) {
        this.paso.a -= this.velocidadLateral
        if (this.paso.a<0) this.paso.a+=2*Math.PI
      }

      this.modelo.update();

      //Detección de colisiones
      this.hitBoxCoche.setFromObject(this.modelo);


      for (let i = 0; i < 20; i++ && !this.colision_detectada) {
        this.orbes[i].update();
        
        var cajaOrbe = new THREE.Box3();
        cajaOrbe.setFromObject(this.orbes[i]);
  
        if(this.hitBoxCoche.intersectsBox(cajaOrbe)){
          this.colision_detectada=true;
          //this.aplicarBonificacion(this.orbes[i].getTipo());
          //this.remove(this.orbes[i]);
        }
      }
      
      if(this.bonificadorTamaño>1){
        this.modelo.scale.set(this.bonificadorTamaño,this.bonificadorTamaño,this.bonificadorTamaño);
        
      }
    }
   
    this.posicionAnimacion = this.spline.getPointAt(this.paso.t);
    this.modelo.position.copy(this.posicionAnimacion);
    var tangente = this.spline.getTangentAt(this.paso.t);
    this.posicionAnimacion.add(tangente);
    this.modelo.lookAt(this.posicionAnimacion);

    if(!this.almacenadoInicio){
      this.puntoInicio=this.modelo.position;
      this.almacenadoInicio=true;
    }else{
      if(this.puntoInicio==this.modelo.position){
        //this.completarVuelta();
      }
    }
    const momentoactual = new Date();
    this.tiempoTranscurrido = momentoactual.getTime() - this.inicio.getTime();

    if( this.tiempoTranscurrido >= this.TiempoRestante){
      this.finJuego=true;
    }
    
    if(this.iniciadaBonificacion){
      this.inicioBonificacion= new Date();
      this.iniciadaBonificacion=false;
      this.bonicacionEnCurso=true;
    }

    this.tiempoTranscurridoBonif = momentoactual.getTime() - this.inicioBonificacion.getTime();

    //Si se cumple el tiempo de la bonificacion
    if(this.bonicacionEnCurso && this.tiempoTranscurridoBonif >= this.tiempoEfecto){
      this.bonicacionEnCurso=false;
      this.reset();
    }

    TWEEN.update();
    this.modelo.rotateZ(this.paso.a)
    this.modelo.translateY(this.circuitoGeom.parameters.radius+0.4)
  
    requestAnimationFrame(() => this.update());
    if(!this.finJuego)this.updateGUI();
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});