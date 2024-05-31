import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { TWEEN } from '../libs/Tween.js'

import { Coche } from '../objetos/coche/Coche.js'
import { Orbe, TipoOrbe } from '../objetos/orbe/Orbe.js'
import { Obstaculo, TipoObstaculo } from '../objetos/obstaculo/Obstaculo.js'
import { Escorvispa, TipoEscorvispa } from '../objetos/escorvispa/Escorvispa.js'

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
    this.initMouseEvents();

    //Velocidades
    this.velocidadCoche = 0.00025;
    this.velocidadLateral = 0.03;
    this.velocidadDisparo=0;

    //Control de Juego
    this.finJuego =false;
    this.puntuacion=-0;
    this.vueltas=1;
    this.almacenadoInicio=false;
    this.bonicacionEnCurso=false;
    this.iniciadaBonificacion=false;
    this.colision_detectada=false;
    this.colision_obstaculo=false;
    this.bonificacionActiva = "Ninguna";
    this.numOrbes = 36;
    this.tiposdeOrbe=6;
    this.numObstaculos = 15;
    this.numVoladores = 10;

    //Bonificadores
    this.bonificadorCadencia=1.0;
    this.bonificadorVelocidad=1.0;
    this.bonificadorTamanio=1.0;
    this.bonificadorVueltas=1.0;
    this.bonificadorDanio=1.0;
    this.bonificadorPuntos=1.0;

    //Penalizacion
    this.efectoActivo="Ninguno";
    this.penalizacionVelocidad=1.0;
    this.penalizacionVelocidadLateral=1.0;
    this.penalizacionCadencia=1.0;
    this.valorLuz=500;

    //Tiempos
    this.TiempoRestante = 180000; //3 minutos
    this.tiempoEspecial=2000
    this.tiempoEfecto=10000 //10s
    this.inicio = new Date(); //Momento de inicio
    this.inicioBonificacion = new Date();
    this.tiempoTranscurridoBonif=0;
    this.tiempoTranscurrido=0;
    this.momentoMeta = new Date();

    //Modelos
    this.modelo = new Coche(this.gui, "Coche");
    //this.modelo.minigun.rotateX(THREE.MathUtils.degToRad(90))
    this.add(this.modelo);
    this.spotLight.target = this.modelo; // un Object3D que representa un coche
    this.modelo.add(this.spotLight)

    // //Hitbox
    this.hitBoxCoche = new THREE.Box3();
    // var hitBoxHelper = new THREE.Box3Helper( this.hitBoxCoche , 0x000000 );
    // this.add(hitBoxHelper);

    this.createThirdPersonCamera();

    // Pick
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.pickableObjects = [];  

    this.createOrbes();
    this.createObstaculos();
    this.createVoladores();
  }

  completarVuelta(){
    //10% más rápido cada vuelta;
    this.bonificadorVueltas+=0.1;
    this.puntuacion += 100*this.bonificadorPuntos;
    this.vueltas+=1;
  }

  aplicarBonificacion( tipo){

    console.log("Bonificacion obtenida: " + tipo)

    this.bonificacionActiva=tipo;
    this.iniciadaBonificacion=true;
    this.spotLight.intensity=50
    switch(tipo){
      case TipoOrbe.CADENCIA:
        //+25% cadencia durante 10 segundos
        this.bonificadorCadencia=2;
        this.spotLight.color.set(0x00008b)
        break;
      case TipoOrbe.TIEMPO_AMPLIADO:
        // +10s
        this.TiempoRestante+=10000;
        this.tiempoEfecto=this.tiempoEspecial;
        this.spotLight.color.set(0x3a9d23)
        break;
      case TipoOrbe.VELOCIDAD_AUMENTADA:
        // +50% velocidad durante 10 segundos
        this.bonificadorVelocidad=1.5;
        this.spotLight.color.set(0x81d8d0)
        break;
      case TipoOrbe.TAMAÑO_AUMENTADO:
        // x2 de tamaño durante 10 segundos
        this.bonificadorTamaño=2;
        this.spotLight.color.set(0xa212a2)
        break;
      case TipoOrbe.DAÑO_AUMENTADO:
        // X2 de daño
        this.bonificadorDanio=2;
        this.spotLight.color.set(0xf52a00)
        break;
      case TipoOrbe.REPARAR:
        // Eliminar efecto malo
        this.tiempoEfecto=this.tiempoEspecial;
        this.reparar();
        this.spotLight.color.set(0xff9300)
        break;
      case TipoOrbe.PUNTOS:
        //Doble puntuacion
        this.bonificadorPuntos=2;
        this.spotLight.color.set(0xffff00)
        break;
    }
  }

  aplicarPenalizacion(tipo){
    console.log("Has chocado con " + tipo)
    switch(tipo){
      case TipoObstaculo.BABOSA:
        this.efectoActivo = "Lentitud";
        this.penalizacionVelocidad=0.5;
      break;
      case TipoObstaculo.ORUGA:
        this.efectoActivo = "Visibilidad reducida";
        this.setAmbientIntensity(0);
        //this.penalizacionVelocidadLateral=0.25;
      break;
      case TipoObstaculo.HORMIGA:
        this.efectoActivo = "Lentitud lateral";
        this.penalizacionVelocidadLateral=0.25;
      break;

    }
  }

  reset(){
    this.bonificadorVelocidad=1.0;
    this.bonificadorTamaño=1.0;
    this.modelo.scale.set(1,1,1);

    this.bonificadorPuntos=1.0;
    this.bonificadorDanio=1.0;
    this.tiempoEfecto=10000;

    this.tiempoTranscurridoBonif=0;
    this.iniciadaBonificacion=false;
    this.bonificacionActiva="Ninguna";

    this.spotLight.intensity=0
  }

  reparar(){
    this.penalizacionCadencia=1.0;
    this.penalizacionVelocidad=1.0;
    this.penalizacionVelocidadLateral=1.0;
    this.setAmbientIntensity(1);
    this.efectoActivo="Ninguno";
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
    
    this.estaciones = this.numOrbes/6;
    this.orbes = [];
    
    for (let i = 0; i < this.estaciones; i++) {
      const orbe1 = new Orbe(TipoOrbe.PUNTOS);
      const orbe2 = new Orbe(TipoOrbe.REPARAR);
      const orbe3 = new Orbe(TipoOrbe.TIEMPO_AMPLIADO);
      const orbe4 = new Orbe(TipoOrbe.TAMAÑO_AUMENTADO);
      const orbe5 = new Orbe(TipoOrbe.VELOCIDAD_AUMENTADA);
      const orbe6 = new Orbe(TipoOrbe.DAÑO_AUMENTADO);

      const positionOrbe = this.spline.getPointAt(i / this.estaciones);

      const tangent = this.spline.getTangentAt(i / this.estaciones);
      
      orbe1.position.copy(positionOrbe);
      orbe1.lookAt(positionOrbe.clone().add(tangent));
      orbe2.position.copy(positionOrbe);
      orbe2.lookAt(positionOrbe.clone().add(tangent));
      orbe3.position.copy(positionOrbe);
      orbe3.lookAt(positionOrbe.clone().add(tangent));
      orbe4.position.copy(positionOrbe);
      orbe4.lookAt(positionOrbe.clone().add(tangent));
      orbe5.position.copy(positionOrbe);
      orbe5.lookAt(positionOrbe.clone().add(tangent));
      orbe6.position.copy(positionOrbe);
      orbe6.lookAt(positionOrbe.clone().add(tangent));

      orbe1.rotateZ(THREE.MathUtils.degToRad(0));
      orbe2.rotateZ(THREE.MathUtils.degToRad(60));
      orbe3.rotateZ(THREE.MathUtils.degToRad(120));
      orbe4.rotateZ(THREE.MathUtils.degToRad(180));
      orbe5.rotateZ(THREE.MathUtils.degToRad(240));
      orbe6.rotateZ(THREE.MathUtils.degToRad(300));
      
      this.orbes.push(orbe1);
      this.add(orbe1);
      this.orbes.push(orbe2);
      this.add(orbe2);
      this.orbes.push(orbe3);
      this.add(orbe3);
      this.orbes.push(orbe4);
      this.add(orbe4);
      this.orbes.push(orbe5);
      this.add(orbe5);
      this.orbes.push(orbe6);
      this.add(orbe6);
    }
}


  createObstaculos() {
    this.obstaculos = [];

    for (let i = 0; i < this.numObstaculos; i++) {
      const obstaculo = new Obstaculo();

      const positionObstaculo = this.spline.getPointAt(i / this.numObstaculos);

      const tangent = this.spline.getTangentAt(i / this.numObstaculos);
      obstaculo.position.copy(positionObstaculo);
      obstaculo.lookAt(positionObstaculo.clone().add(tangent));

      this.obstaculos.push(obstaculo);
      this.add(obstaculo);
    }

  }

  createVoladores() {
    this.voladores = []
    this.recorridos = []
    this.posiciones = []
    const periodicidad = 1/(this.numVoladores)
    this.vuelo = {t: 0}
    // 2/3 de esbirros, 1/3 soldados y 1 reina
    for (let i=0 ; i<this.numVoladores-1 ; i++) {
      var volador
      if (i%3==0) volador = new Escorvispa(TipoEscorvispa.SOLDADO)
      else volador = new Escorvispa(TipoEscorvispa.ESBIRRO)
      var ubicacion = this.spline.getPointAt((i+1)*periodicidad)
      var recorrido = this.createRecorrido(ubicacion, 0, (i+1)*periodicidad)
      var posicion = recorrido.getPointAt(this.vuelo.t)
      volador.position.copy(posicion)
      var tangente = recorrido.getTangentAt(this.vuelo.t)
      posicion.add(tangente)
      volador.lookAt(posicion)
      this.voladores.push(volador)
      this.recorridos.push(recorrido)
      this.posiciones.push(posicion)
      this.pickableObjects.push(volador)
      this.add(volador)
    }

    var reina = new Escorvispa(TipoEscorvispa.REINA)
    var ubicacion = this.spline.getPointAt(this.numVoladores*periodicidad)
    var recorrido = this.createRecorrido(ubicacion, 0, this.numVoladores*periodicidad)
    var posicion = recorrido.getPointAt(this.vuelo.t)
    reina.position.copy(posicion)
    var tangente = recorrido.getTangentAt(this.vuelo.t)
    posicion.add(tangente)
    reina.lookAt(posicion)
    this.voladores.push(reina)
    this.recorridos.push(recorrido)
    this.posiciones.push(posicion)
    this.pickableObjects.push(reina)
    this.add(reina)

    // En los 4 lados
    for (let i=0 ; i<this.numVoladores-1 ; i++) {
      var volador
      if (i%3==0) volador = new Escorvispa(TipoEscorvispa.SOLDADO)
      else volador = new Escorvispa(TipoEscorvispa.ESBIRRO)
      var ubicacion = this.spline.getPointAt((i+1)*periodicidad)
      var recorrido = this.createRecorrido(ubicacion, 90, (i+1)*periodicidad)
      var posicion = recorrido.getPointAt(this.vuelo.t)
      volador.position.copy(posicion)
      var tangente = recorrido.getTangentAt(this.vuelo.t)
      posicion.add(tangente)
      volador.lookAt(posicion)
      this.voladores.push(volador)
      this.recorridos.push(recorrido)
      this.posiciones.push(posicion)
      this.pickableObjects.push(volador)
      this.add(volador)
    }

    var reina = new Escorvispa(TipoEscorvispa.REINA)
    var ubicacion = this.spline.getPointAt(this.numVoladores*periodicidad)
    var recorrido = this.createRecorrido(ubicacion, 90, this.numVoladores*periodicidad)
    var posicion = recorrido.getPointAt(this.vuelo.t)
    reina.position.copy(posicion)
    var tangente = recorrido.getTangentAt(this.vuelo.t)
    posicion.add(tangente)
    reina.lookAt(posicion)
    this.voladores.push(reina)
    this.recorridos.push(recorrido)
    this.posiciones.push(posicion)
    this.pickableObjects.push(reina)
    this.add(reina)

    for (let i=0 ; i<this.numVoladores-1 ; i++) {
      var volador
      if (i%3==0) volador = new Escorvispa(TipoEscorvispa.SOLDADO)
      else volador = new Escorvispa(TipoEscorvispa.ESBIRRO)
      var ubicacion = this.spline.getPointAt((i+1)*periodicidad)
      var recorrido = this.createRecorrido(ubicacion, 180, (i+1)*periodicidad)
      var posicion = recorrido.getPointAt(this.vuelo.t)
      volador.position.copy(posicion)
      var tangente = recorrido.getTangentAt(this.vuelo.t)
      posicion.add(tangente)
      volador.lookAt(posicion)
      this.voladores.push(volador)
      this.recorridos.push(recorrido)
      this.posiciones.push(posicion)
      this.pickableObjects.push(volador)
      this.add(volador)
    }

    var reina = new Escorvispa(TipoEscorvispa.REINA)
    var ubicacion = this.spline.getPointAt(this.numVoladores*periodicidad)
    var recorrido = this.createRecorrido(ubicacion, 180, this.numVoladores*periodicidad)
    var posicion = recorrido.getPointAt(this.vuelo.t)
    reina.position.copy(posicion)
    var tangente = recorrido.getTangentAt(this.vuelo.t)
    posicion.add(tangente)
    reina.lookAt(posicion)
    this.voladores.push(reina)
    this.recorridos.push(recorrido)
    this.posiciones.push(posicion)
    this.pickableObjects.push(reina)
    this.add(reina)

    for (let i=0 ; i<this.numVoladores-1 ; i++) {
      var volador
      if (i%3==0) volador = new Escorvispa(TipoEscorvispa.SOLDADO)
      else volador = new Escorvispa(TipoEscorvispa.ESBIRRO)
      var ubicacion = this.spline.getPointAt((i+1)*periodicidad)
      var recorrido = this.createRecorrido(ubicacion, 270, (i+1)*periodicidad)
      var posicion = recorrido.getPointAt(this.vuelo.t)
      volador.position.copy(posicion)
      var tangente = recorrido.getTangentAt(this.vuelo.t)
      posicion.add(tangente)
      volador.lookAt(posicion)
      this.voladores.push(volador)
      this.recorridos.push(recorrido)
      this.posiciones.push(posicion)
      this.pickableObjects.push(volador)
      this.add(volador)
    }

    var reina = new Escorvispa(TipoEscorvispa.REINA)
    var ubicacion = this.spline.getPointAt(this.numVoladores*periodicidad)
    var recorrido = this.createRecorrido(ubicacion, 270, this.numVoladores*periodicidad)
    var posicion = recorrido.getPointAt(this.vuelo.t)
    reina.position.copy(posicion)
    var tangente = recorrido.getTangentAt(this.vuelo.t)
    posicion.add(tangente)
    reina.lookAt(posicion)
    this.voladores.push(reina)
    this.recorridos.push(recorrido)
    this.posiciones.push(posicion)
    this.pickableObjects.push(reina)
    this.add(reina)

    /*
    this.volador = new Escorvispa(TipoEscorvispa.ESBIRRO)
    this.posicionRecorrido = this.spline.getPointAt(0.01);
    this.recorrido = this.createRecorrido(this.posicionRecorrido)
    this.vuelo = {t: 0.01}
    this.posicionVolador = this.recorrido.getPointAt(this.vuelo.t)
    this.volador.position.copy(this.posicionVolador);
    var tangente = this.recorrido.getTangentAt(this.vuelo.t);
    this.posicionVolador.add(tangente);
    this.volador.lookAt(this.posicionVolador);
    this.add(this.volador)
    this.pickableObjects.push(this.volador)
    */
    
  }

  createRecorrido(posicion, angulo, punto) {
    // Generar aleatorio 1-4
    // Math.floor(Math.random() * 4) + 1;
    var recorridoGeom = new THREE.TorusKnotGeometry(6, 1, 30, 3, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1);
    var torusKnotMesh = new THREE.Mesh(recorridoGeom, this.material);
    
    torusKnotMesh.position.copy(posicion);
    //torusKnotMesh.rotateX(THREE.MathUtils.degToRad(90));
    
    var tangente = this.spline.getTangentAt(punto);
    posicion.add(tangente);
    
    torusKnotMesh.lookAt(posicion)
    torusKnotMesh.rotateZ(THREE.MathUtils.degToRad(angulo))
    
    torusKnotMesh.translateY(this.circuitoGeom.parameters.radius+recorridoGeom.parameters.radius*2.5)
    torusKnotMesh.rotateX(THREE.MathUtils.degToRad(90))
    
    
    //this.add (torusKnotMesh)

    // Actualizar la matriz del Mesh y aplicar la transformación a la geometría
    torusKnotMesh.updateMatrix();
    // recorridoGeom.applyMatrix4(torusKnotMesh.matrix);
    var path = this.getPathFromTorusKnot(recorridoGeom);
    var puntosTransformados = path.getPoints(100).map(point => {
      return point.applyMatrix4(torusKnotMesh.matrix);
    });
    var recorridoPath = new THREE.CatmullRomCurve3(puntosTransformados, true)
    var geometryLine = new THREE.BufferGeometry();
    geometryLine.setFromPoints(puntosTransformados);
    var material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2,
    });
    var visibleSpline = new THREE.Line(geometryLine, material);

    //this.add(visibleSpline);
    return recorridoPath
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
          this.flechaizq = true
          this.izquierda = true
          break;
        case "ArrowRight":
          this.flechadch = true
          this.derecha = true
          break;
        case "KeyA":
          this.teclaa = true
          this.izquierda = true
          break;
        case "KeyD":
          this.teclad = true;
          this.derecha = true
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
          this.flechaizq = false
          if (!this.teclaa) this.izquierda = false
          break;
        case "ArrowRight":
          this.flechadch = false
          if (!this.teclad) this.derecha = false;
          break;
          case "KeyA":
            this.teclaa = false
            if (!this.flechaizq) this.izquierda = false
            break;
          case "KeyD":
            this.teclad = false
            if (!this.flechadch) this.derecha = false;
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

  initMouseEvents() {
    window.addEventListener("mousedown", (event) => {

      if (this.modelo.minigun.guiControls.rotandoPlato == true){
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

        this.raycaster.setFromCamera(this.mouse, this.thirdPersonCamera);

        this.modelo.minigun.disparar();
        var pickedObjects = this.raycaster.intersectObjects(this.pickableObjects);

        if (pickedObjects.length > 0 && this.cameraIndex == 1) {
          var selectedObject = pickedObjects[0].object.userData;

          selectedObject.pick(this.bonificadorDanio)
          this.modelo.minigun.lookAt(selectedObject.position);
          this.modelo.minigun.rotateX(THREE.MathUtils.degToRad(90));
          this.modelo.minigun.rotateY(THREE.MathUtils.degToRad(-90));
          

          if (selectedObject.vida <= 0){ 
            this.remove(selectedObject);
            this.puntuacion+=selectedObject.puntuacion*this.bonificadorPuntos;
          }
        }
      }
    });

    window.addEventListener("mousedown", (event) => {
        if (event.button === 2) {
            this.modelo.minigun.guiControls.rotandoPlato = true;
        }
    });

    window.addEventListener("mouseup", (event) => {
        if (event.button === 2) {
            this.modelo.minigun.guiControls.rotandoPlato = false;
        }
    });
  }

  createCircuito() {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load("../imgs/colmena.jpg", function(texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      texture.repeat.set(8, 2);
    });
  
    this.materialColmena = new THREE.MeshStandardMaterial({ map: texture });

    var material = new THREE.MeshStandardMaterial({
      normalMap: texture,
      normalScale: new THREE.Vector2(1, 1),
    });

    var materialAlambre = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: true
  });
  

    this.circuitoTorusGeom = new THREE.TorusKnotGeometry(100, 4, 50, 20, 2, 3);

    this.spline = this.getPathFromTorusKnot(this.circuitoTorusGeom);

    var geometryLine = new THREE.BufferGeometry();
    
    this.circuitoGeom = new THREE.TubeGeometry(this.spline, 100, 20, 20);
    this.circuito = new THREE.Mesh(this.circuitoGeom, this.materialColmena);
    //this.circuito.material = materialAlambre;
    this.circuito.castShadow = false;
    this.circuito.receiveShadow = true;

    this.add(this.circuito);

    var texture = new THREE.TextureLoader().load('../imgs/meta.jpg');
    var materialMeta = new THREE.MeshBasicMaterial({map: texture});

    this.metaGeom = new THREE.TorusGeometry(30,3,10,20);
    this.meta = new THREE.Mesh(this.metaGeom, materialMeta);
    this.circuito.add(this.meta);

    this.meta.position.set(150,-15,-10);
    this.meta.rotateX(THREE.MathUtils.degToRad(-65));

    this.hitboxMeta = new THREE.Box3();
    this.hitboxMeta.setFromObject(this.meta);

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

    this.thirdPersonCamera.position.set(0, 3, -15);
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
    this.guiControls.efecto = this.efectoActivo;
    this.guiControls.velocidad = this.bonificadorVelocidad*this.bonificadorVueltas;
    
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
      bonificacion: "Ninguna",
      efecto: "Ninguno",
      velocidad: ""
    };

    gui.add(this.guiControls, "tiempoRestante").name("Tiempo Restante");
    gui.add(this.guiControls, "vueltasRealizadas").name("Vueltas Realizadas");
    gui.add(this.guiControls, "puntos").name("Puntos");
    gui.add(this.guiControls, "bonificacion").name("Bonificacion Activa");
    gui.add(this.guiControls, "efecto").name("Efecto activo:");
    gui.add(this.guiControls, 'velocidad').name("Multiplicador V");
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
    this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(0, 0, 0);
    this.add(this.pointLight);

    // Crea una luz spotlight con parámetros personalizados
    this.spotLight = new THREE.SpotLight(0xffff00);
    this.spotLight.power = 1000;
    this.spotLight.angle = Math.PI / 5;
    this.spotLight.penumbra = 0.5;
    this.spotLight.position.set(0, 3, 0);
    this.spotLight.intensity = 0
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
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
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
    
    const momentoactual = new Date();
    this.tiempoTranscurrido = momentoactual.getTime() - this.inicio.getTime();

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
        this.paso.t += this.velocidadCoche*this.bonificadorVelocidad*this.bonificadorVueltas*this.penalizacionVelocidad;
        this.paso.t %= 1
      } 

      if(this.derecha) {
        this.paso.a += this.velocidadLateral*this.penalizacionVelocidadLateral;
        this.paso.a %= 2*Math.PI
      }

      if(this.izquierda) {
        this.paso.a -= this.velocidadLateral*this.penalizacionVelocidadLateral
        if (this.paso.a<0) this.paso.a+=2*Math.PI
      }

      this.modelo.update();

      //Detección de colisiones
      this.hitBoxCoche.setFromObject(this.modelo);

      if(this.hitBoxCoche.intersectsBox(this.hitboxMeta) && !this.colisionMeta){
        this.colisionMeta=true;
        this.momentoMeta = new Date();
        this.completarVuelta();
      }

      if((momentoactual.getTime() - this.momentoMeta.getTime()) >= 5000){
        this.colisionMeta=false;
      }

      for (let i = 5; i < this.numOrbes; i++ && !this.colision_detectada) {
        this.velocidadOrbes=0.01;
        const orbe = this.orbes[i];
        
        const posicionOrbe = this.spline.getPointAt(Math.floor(i / 6) / this.estaciones);
        orbe.position.copy(posicionOrbe);

        orbe.rotateZ(-this.velocidadOrbes);
        orbe.translateY(this.circuitoGeom.parameters.radius + 1)

        var cajaOrbe = new THREE.Box3();
        cajaOrbe.setFromObject(this.orbes[i]);
  
        if(!this.colision_detectada && this.hitBoxCoche.intersectsBox(cajaOrbe)){
          this.colision_detectada=true;

          this.aplicarBonificacion(this.orbes[i].getTipo()); 
        }
      }

      for (let i = 1; i < this.numObstaculos; i++) {
        var speed=0;
        const obstaculo = this.obstaculos[i];
        const posicionObstaculo = this.spline.getPointAt(i / this.numObstaculos);
        obstaculo.position.copy(posicionObstaculo);

        switch(obstaculo.tipo){
          case TipoObstaculo.BABOSA: speed=0.01; break
          case TipoObstaculo.ORUGA: speed=0.02; break
          case TipoObstaculo.ORUGA: speed=0.04; break
          default: speed=0.01;
        }

        obstaculo.rotateZ(speed);
        obstaculo.translateY(this.circuitoGeom.parameters.radius)

        var cajaObstaculo = new THREE.Box3();
        cajaObstaculo.setFromObject(this.obstaculos[i]);

        if(this.efectoActivo == "Ninguno" && this.hitBoxCoche.intersectsBox(cajaObstaculo)){
          this.aplicarPenalizacion(this.obstaculos[i].tipo);
          
        }
        
        obstaculo.update();
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

    this.vuelo.t += 0.0005
    this.vuelo.t %= 1
    for (let i=0 ; i<this.voladores.length ; i++) {
      this.posiciones[i] = this.recorridos[i].getPointAt(this.vuelo.t)
      this.voladores[i].position.copy(this.posiciones[i]);
      var tangente = this.recorridos[i].getTangentAt(this.vuelo.t);
      this.posiciones[i].add(tangente);
      this.voladores[i].lookAt(this.posiciones[i]);
      this.voladores[i].update();
    }

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
      this.colision_detectada=false;
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