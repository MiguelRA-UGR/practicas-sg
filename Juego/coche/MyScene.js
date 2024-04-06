import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

import { Escorvispa,TipoEscorvispa } from '../escorvispa/Escorvispa.js'
import { Coche } from './Coche.js'
import { Motor } from './Motor.js'
import { Minigun } from './Minigun.js'
import { Orbe,TipoOrbe } from './Orbe.js'
import { Bala } from './Bala.js'
import { Babosa } from './Babosa.js'

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
    this.createCircuito();

    //Modelos
  ////////////////////////////////////////////////////////////////////
    /*
    this.escorvispa = new Escorvispa(this.gui, "Escorvispa",TipoEscorvispa.REINA);
    //this.escorvispa.position.set(2.8,0,0);
    //this.escorvispa.scale.set(0.5,0.5,0.5);
    this.add(this.escorvispa);
    */
   //////////////////////////////////////////////////////////////////
    
    this.coche = new Coche(this.gui, "Coche");
    this.add(this.coche);
    
  ////////////////////////////////////////////////////////////////////
    /*
    this.minigun = new Minigun(this.gui, "Minigun")
    this.add(this.minigun);
    */
  ////////////////////////////////////////////////////////////////////
    /*
    this.paredGeom = new THREE.BoxGeometry(5,2,0.2);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    this.pared = new THREE.Mesh(this.paredGeom,material);
    this.pared.position.set(0,1,4);
    this.add(this.pared);
    */
  ////////////////////////////////////////////////////////////////////
    /*
    this.orbe1 = new Orbe(TipoOrbe.DAÑO_AUMENTADO);
    this.orbe1.scale.set(3,3,3);
    //this.orbe1.position.set(3,0,0);
    this.add(this.orbe1);
    */
  ////////////////////////////////////////////////////////////////////

    //this.babosa = new Babosa();
    //this.add(this.babosa);

  }
  
  createCircuito(){
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/colmena.jpg');
		this.materialColmena = new THREE.MeshBasicMaterial({ map: texture});

    var material = new THREE.MeshStandardMaterial( {
      normalMap: texture, // Asigna la textura normal
      // Puedes ajustar la intensidad del relieve si lo deseas
      normalScale: new THREE.Vector2( 1, 1 ) // Ajusta según tu preferencia
  } );

    this.circuitoGeom = new THREE.TorusKnotGeometry(20,4,50,20,2,3);
    this.circuitoKnot = new THREE.Mesh(this.circuitoGeom,material);
    this.add(this.circuitoKnot);
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

  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
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
      axisOnOff : true
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
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
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
    //this.escorvispa.update();
    this.coche.update();
    //this.minigun.update();

   //this.orbe1.update();
   //this.babosa.update();

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();
});
