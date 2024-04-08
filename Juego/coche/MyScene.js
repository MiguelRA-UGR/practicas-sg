import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { TWEEN } from '../libs/Tween.js'

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
    
    this.initKeyboardEvents();

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
    this.createFixedCamera();
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
  
  initKeyboardEvents() {
    // Manejar los eventos del teclado para alternar entre las cámaras
    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            this.toggleCamera();
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

    var spline = this.getPathFromTorusKnot(this.circuitoGeom);

    var geometryLine = new THREE.BufferGeometry();

    geometryLine.setFromPoints (spline.getPoints(100));
    var material = new THREE.LineBasicMaterial({color : 0xff0000 , linewidth : 2} ) ;
    var visibleSpline = new THREE.Line( geometryLine , material);

    this.segmentos = 100;
    this.binormales = spline.computeFrenetFrames(this.segmentos,true).binormals ;

    var origen = { t : 0} ;
    var fin = { t : 1} ;
    var tiempoDeRecorrido = 40000;
  /*
    this.animacion = new TWEEN.Tween(origen)
    .to(fin, tiempoDeRecorrido)
    .onUpdate(() => {
        var posicion = spline.getPointAt(origen.t);
        this.coche.position.copy(posicion);
        var tangente = spline.getTangentAt(origen.t);
        posicion.add(tangente);
        this.coche.up = this.binormales[Math.floor(origen.t * this.segmentos)];
        this.coche.lookAt(posicion);
      })
      .repeat(Infinity)
      .yoyo(true)
      .start( ) ;
        
    ;
*/
    
    this.add(visibleSpline);
    //this.add(this.circuitoKnot);
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
    this.fixedCamera.lookAt(this.coche.position);
    this.add(this.fixedCamera);
  }

  updateFixedCamera() {
    const forwardDirection = new THREE.Vector3();
    this.coche.getWorldDirection(forwardDirection);

    const offsetDistance = 10;

    const offset = forwardDirection.clone().multiplyScalar(-offsetDistance);
    const position = this.coche.position.clone().add(offset);
    position.y -= 5;
    this.fixedCamera.position.copy(position);

    const angle = Math.atan2(forwardDirection.x, forwardDirection.z);

    this.fixedCamera.rotation.y = angle;

    this.fixedCamera.lookAt(this.coche.position);
}

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

  update () {
    if (this.stats) this.stats.update();
    this.cameraControl.update();
    //this.escorvispa.update();
    this.coche.update();
    
    TWEEN.update();

    this.updateFixedCamera();

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
