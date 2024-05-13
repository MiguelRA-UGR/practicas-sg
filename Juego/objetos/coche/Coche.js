import * as THREE from "../../libs/three.module.js";
import { CSG } from "../../libs/CSG-v2.js";
import { MTLLoader } from "../../libs/MTLLoader.js";
import { OBJLoader } from "../../libs/OBJLoader.js";

import { Motor } from "../motor/Motor.js";
import { Minigun } from "../minigun/Minigun.js";

class Coche extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.crearMateriales();
    this.crearBase();
    this.cargarModelos();
    this.crearFocos();
    this.crearParachoques();
    this.crearEscapes();
    this.crearGuardaBarros();
    this.crearChasis();
    this.crearVolante();

    this.motor = new Motor(gui, "Motor");
    this.motor.scale.set(0.4, 0.4, 0.4);
    this.motor.position.set(0, 0.05, -0.8);
    this.add(this.motor);

    this.minigun = new Minigun(gui, "Minigun");
    this.minigun.scale.set(0.2, 0.2, 0.2);
    this.minigun.position.set(0, 1.5, 0);
    this.minigun.rotateX(THREE.MathUtils.degToRad(90));
    this.add(this.minigun);

    this.motor.motorEncendido=true;

    this.add(this.base);

    this.translateY(0.53);
  }

  crearMateriales() {
    var textureLoader = new THREE.TextureLoader();
    var texture1 = textureLoader.load("../imgs/acero.jpg");

    this.planchaMetal = new THREE.MeshPhongMaterial({
      map: texture1,
      color: 0x8a9597,
      specular: 0x222222,
      shininess: 100,
    });

    var texture2 = textureLoader.load("../imgs/gradient.png");

    this.tuboEscapeMat = new THREE.MeshStandardMaterial({
      map: texture2,
      color: 0x8a9597,
      side: THREE.DoubleSide,
      metalness: 0.5,
      roughness: 0.5,
    });

    this.escapeMat = new THREE.MeshStandardMaterial({
      color: 0x767d80,
      side: THREE.DoubleSide,
      metalness: 0.5,
      roughness: 0.5,
    });

    this.metalGris = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.5,
      roughness: 0.5,
    });

    this.metalPrimario = new THREE.MeshStandardMaterial({
      color: 0x6262dd,
      metalness: 0.5,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    this.metalNegro = new THREE.MeshStandardMaterial({
      color: 0x353535,
      metalness: 0.5,
      roughness: 0.5,
    });

    this.materialFoco = new THREE.MeshStandardMaterial({
      color: 0xffbf00,
      transparent: true,
      opacity: 0.7,
    });
  }

  crearBase() {
    //Definicion de formas para extrusion
    const radius = 0.05;
    const segments = 32;
    this.circleShape = new THREE.Shape();
    this.circleShape.moveTo(radius, 0);
    for (let i = 1; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      this.circleShape.lineTo(x, y);
    }

    var baseShape = new THREE.Shape();
    baseShape.moveTo(0.8, 2.4);
    baseShape.lineTo(1.2, 2);
    baseShape.lineTo(1.2, 1.6);
    baseShape.lineTo(0.8, 1.2);
    baseShape.lineTo(0.8, 0.6);
    baseShape.lineTo(1.2, 0);
    baseShape.lineTo(1.2, -0.6);
    baseShape.lineTo(0.8, -1);
    baseShape.lineTo(0.8, -1.8);
    baseShape.lineTo(1, -2);
    baseShape.lineTo(1.2, -2.2);
    baseShape.lineTo(1, -2.6);
    baseShape.lineTo(0.6, -2.6);
    baseShape.lineTo(0.4, -2.8);
    baseShape.lineTo(-0.4, -2.8);
    baseShape.lineTo(-0.6, -2.6);
    baseShape.lineTo(-1, -2.6);
    baseShape.lineTo(-1.2, -2.2);
    baseShape.lineTo(-1, -2);
    baseShape.lineTo(-0.8, -1.8);
    baseShape.lineTo(-0.8, -1);
    baseShape.lineTo(-1.2, -0.6);
    baseShape.lineTo(-1.2, 0);
    baseShape.lineTo(-0.8, 0.6);
    baseShape.lineTo(-0.8, 1.2);
    baseShape.lineTo(-1.2, 1.6);
    baseShape.lineTo(-1.2, 2);
    baseShape.lineTo(-0.8, 2.4);

    //Definicion de trayectorias de extrusion
    const baseShapePoints = [
      new THREE.Vector3(0.0, 0.1, 2.4),
      new THREE.Vector3(0.8, 0.1, 2.4),
      new THREE.Vector3(1.2, 0.1, 2),
      new THREE.Vector3(1.2, 0.1, 1.6),
      new THREE.Vector3(0.8, 0.1, 1.2),
      new THREE.Vector3(0.8, 0.1, 0.6),
      new THREE.Vector3(1.2, 0.1, 0),
      new THREE.Vector3(1.2, 0.1, -0.6),
      new THREE.Vector3(0.8, 0.1, -1),
      new THREE.Vector3(0.8, 0.1, -1.8),
      new THREE.Vector3(1, 0.1, -2),
      new THREE.Vector3(1.2, 0.1, -2.2),
      new THREE.Vector3(1, 0.1, -2.6),
      new THREE.Vector3(0.6, 0.1, -2.6),
      new THREE.Vector3(0.4, 0.1, -2.8),
      new THREE.Vector3(-0.4, 0.1, -2.8),
      new THREE.Vector3(-0.6, 0.1, -2.6),
      new THREE.Vector3(-1, 0.1, -2.6),
      new THREE.Vector3(-1.2, 0.1, -2.2),
      new THREE.Vector3(-1, 0.1, -2),
      new THREE.Vector3(-0.8, 0.1, -1.8),
      new THREE.Vector3(-0.8, 0.1, -1),
      new THREE.Vector3(-1.2, 0.1, -0.6),
      new THREE.Vector3(-1.2, 0.1, 0),
      new THREE.Vector3(-0.8, 0.1, 0.6),
      new THREE.Vector3(-0.8, 0.1, 1.2),
      new THREE.Vector3(-1.2, 0.1, 1.6),
      new THREE.Vector3(-1.2, 0.1, 2),
      new THREE.Vector3(-0.8, 0.1, 2.4),
      new THREE.Vector3(0.0, 0.1, 2.4),
    ];

    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(0, 0.05, 0);
    //Path de la base
    const path = new THREE.CatmullRomCurve3([start, end]);

    //Path del chasis de la base
    const pathChasis = new THREE.CatmullRomCurve3(
      baseShapePoints,
      false,

    );

    var extrudeSettingsBase = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: path,
    };

    var extrudeSettingsBaseChasis = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: pathChasis,
    };

    var baseChasisGeom = new THREE.TubeGeometry(pathChasis,25,0.05,20);
    var baseGeom = new THREE.ExtrudeGeometry(baseShape, extrudeSettingsBase);
    this.base = new THREE.Mesh(baseGeom, this.planchaMetal);
    this.baseChasis = new THREE.Mesh(baseChasisGeom, this.metalGris);

    this.baseChasis.rotateY(THREE.MathUtils.degToRad(-90));
    this.base.rotateY(THREE.MathUtils.degToRad(-90));

    this.ejeRuedaGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 20, 20);
    this.ejeRuedaGeom.rotateX(THREE.MathUtils.degToRad(-90));
    this.ejerueda1 = new THREE.Mesh(this.ejeRuedaGeom, this.metalGris);

    this.ejerueda2 = this.ejerueda1.clone();
    this.ejerueda3 = this.ejerueda1.clone();
    this.ejerueda4 = this.ejerueda1.clone();

    this.ejerueda1.position.set(1.4, 0, 1);
    this.ejerueda2.position.set(1.4, 0, -1);

    this.ejerueda3.scale.set(1, 1, 1.2);
    this.ejerueda4.scale.set(1, 1, 1.2);
    this.ejerueda3.position.set(-0.8, 0.3, 1.25);
    this.ejerueda4.position.set(-0.8, 0.3, -1.25);

    this.base.add(this.ejerueda1);
    this.base.add(this.ejerueda2);
    this.base.add(this.ejerueda3);
    this.base.add(this.ejerueda4);
    this.base.add(this.baseChasis);

    this.add(this.base);
  }

  crearGuardaBarros() {
    this.piezaGuardaBarrosGeom = new THREE.TorusGeometry(0.7, 0.4, 20, 20);
    this.piezaGuardaBarros = new THREE.Mesh(
      this.piezaGuardaBarrosGeom,
      this.metalPrimario
    );

    this.piezaGuardaBarrosHuecoGeom = new THREE.TorusGeometry(
      0.55,
      0.5,
      20,
      20
    );
    this.piezaGuardaBarrosHueco = new THREE.Mesh(
      this.piezaGuardaBarrosHuecoGeom,
      this.metalPrimario
    );

    this.cuboHuecoGeom = new THREE.BoxGeometry(3, 1.1, 2);
    this.cuboHueco = new THREE.Mesh(this.cuboHuecoGeom, this.metalPrimario);
    this.cuboHueco.position.set(0, -0.6, 0);

    this.piezaGuardaBarrosCSG = new CSG();
    this.piezaGuardaBarrosCSG.subtract([
      this.piezaGuardaBarros,
      this.piezaGuardaBarrosHueco,
      this.cuboHueco,
    ]);
    this.piezaGuardaBarros = this.piezaGuardaBarrosCSG.toMesh();

    this.interiorGuardaBarrosGeom = new THREE.CylinderGeometry(
      0.95,
      0.2,
      0.5,
      20,
      20
    );
    this.interiorGuardaBarros = new THREE.Mesh(
      this.interiorGuardaBarrosGeom,
      this.metalPrimario
    );
    this.interiorGuardaBarros.rotateZ(THREE.MathUtils.degToRad(-90));

    this.interiorGuardaBarrosCSG = new CSG();
    this.interiorGuardaBarrosCSG.subtract([
      this.interiorGuardaBarros,
      this.cuboHueco,
    ]);
    this.interiorGuardaBarros = this.interiorGuardaBarrosCSG.toMesh();
    this.interiorGuardaBarros1 = this.interiorGuardaBarros.clone();
    this.interiorGuardaBarros1.scale.x *= -1;
    this.interiorGuardaBarros.position.set(1.05, 0.2, -0.8);
    this.interiorGuardaBarros1.position.set(-1.05, 0.2, -0.8);

    this.add(this.interiorGuardaBarros);
    this.add(this.interiorGuardaBarros1);

    this.piezaGuardaBarros.rotateY(THREE.MathUtils.degToRad(90));
    this.piezaGuardaBarros1 = this.piezaGuardaBarros.clone();
    this.piezaGuardaBarros.position.set(1.6, 0.2, -0.8);
    this.piezaGuardaBarros1.position.set(-1.6, 0.2, -0.8);

    this.piezaGuardaBarros2 = this.piezaGuardaBarros.clone();
    this.piezaGuardaBarros2.scale.set(0.6, 0.6, 0.9);
    this.piezaGuardaBarros2.position.set(1.3, 0, 1.4);

    this.piezaGuardaBarros3 = this.piezaGuardaBarros.clone();
    this.piezaGuardaBarros3.scale.set(0.6, 0.6, -0.9);
    this.piezaGuardaBarros3.position.set(-1.3, 0, 1.4);

    this.interiorGuardaBarros2 = this.interiorGuardaBarros.clone();
    this.interiorGuardaBarros2.scale.set(0.6, 0.6, 0.6);
    this.interiorGuardaBarros2.position.set(0.85, 0, 1.4);

    this.interiorGuardaBarros3 = this.interiorGuardaBarros.clone();
    this.interiorGuardaBarros3.scale.set(-0.6, 0.6, 0.6);
    this.interiorGuardaBarros3.position.set(-0.85, 0, 1.4);

    this.escalonGeom = new THREE.BoxGeometry(0.3, 0.15, 0.75);
    this.escalon = new THREE.Mesh(this.escalonGeom, this.metalPrimario);
    this.escalon2 = this.escalon.clone();
    this.escalon.position.set(1.4, 0.1, 0.45);
    this.escalon2.position.set(-1.4, 0.1, 0.45);

    this.add(this.escalon);
    this.add(this.escalon2);
    this.add(this.piezaGuardaBarros);
    this.add(this.piezaGuardaBarros1);
    this.add(this.piezaGuardaBarros2);
    this.add(this.piezaGuardaBarros3);
    this.add(this.interiorGuardaBarros2);
    this.add(this.interiorGuardaBarros3);
  }

  crearEscapes() {

    var escape1Points = [
      new THREE.Vector3(0.1, 0.1, -0.6),
      new THREE.Vector3(0.3, 0.1, -0.6),
      new THREE.Vector3(0.3, 0.1, -1),
      new THREE.Vector3(0.5, 0.2, -1.2),
      new THREE.Vector3(0.9, 0.4, -1.6),
      new THREE.Vector3(0.9, 0.8, -2.5),
    ];

    const escape1path = new THREE.CatmullRomCurve3(
      escape1Points,
      false,
      "catmullrom",
      0
    );
    var extrudeSettingsescape1 = {
      steps: 100,
      bevelEnabled: true,
      extrudePath: escape1path,
    };

    this.escape1Geom = new THREE.TubeGeometry(escape1path,20,0.15,20,false);

    this.escape1 = new THREE.Mesh(this.escape1Geom, this.escapeMat);

    this.finEscapeGeom = new THREE.CylinderGeometry(0.16,0.16,0.4,15,15,true);
    this.finEscape = new THREE.Mesh(this.finEscapeGeom, this.tuboEscapeMat);

    this.finEscape2 = this.finEscape.clone();
    this.finEscape.rotateX(THREE.MathUtils.degToRad(-65));
    this.finEscape.position.set(0.9, 0.8, -2.5);

    this.escape1.add(this.finEscape);

    this.escape1a = this.escape1.clone();
    this.escape2 = this.escape1.clone();
    this.escape2a = this.escape1.clone();
    this.escape2.scale.set(0.85, 0.55, 1);
    this.escape2a.scale.set(0.85, 0.55, 1);

    this.escape1a.scale.x *= -1;
    this.escape2a.scale.x *= -1;

    this.add(this.escape1);
    this.add(this.escape1a);
    this.add(this.escape2);
    this.add(this.escape2a);
  }

  crearParachoques() {
    this.parachoquesShape = new THREE.Shape();
    this.parachoquesShape.moveTo(0.0, 0.0);
    this.parachoquesShape.lineTo(-0.25, 0.0);
    this.parachoquesShape.quadraticCurveTo(-0.3, 0.15, -0.2, 0.2);
    this.parachoquesShape.quadraticCurveTo(-0.1, 0.2, -0.05, 0.3);
    this.parachoquesShape.quadraticCurveTo(0.0, 0.4, 0.05, 0.4);
    this.parachoquesShape.lineTo(0.0, 0.0);

    this.parachoquesShape1 = new THREE.Shape();
    this.parachoquesShape1.moveTo(0.0, 0.0);
    this.parachoquesShape1.lineTo(-0.2, 0.0);
    this.parachoquesShape1.lineTo(-0.2, 0.1);
    this.parachoquesShape1.quadraticCurveTo(-0.175, 0.2, -0.15, 0.2);
    this.parachoquesShape1.lineTo(-0.1, 0.2);
    this.parachoquesShape1.quadraticCurveTo(-0.075, 0.2, -0.05, 0.1);
    this.parachoquesShape1.lineTo(-0.05, 0.2);
    this.parachoquesShape1.quadraticCurveTo(0.0, 0.3, 0.05, 0.2);
    this.parachoquesShape1.lineTo(0.05, -0.1);
    this.parachoquesShape1.lineTo(0.0, -0.1);
    this.parachoquesShape1.lineTo(0.0, 0.0);

    var parachoquesPoints = [
      new THREE.Vector3(1.2, 0, 1.95),
      new THREE.Vector3(1.2, 0, 2.2),
      new THREE.Vector3(1, 0, 2.6),
      new THREE.Vector3(0.6, 0, 2.6),
      new THREE.Vector3(0.4, 0, 2.8),
      new THREE.Vector3(-0.4, 0, 2.8),
      new THREE.Vector3(-0.6, 0, 2.6),
      new THREE.Vector3(-1, 0, 2.6),
      new THREE.Vector3(-1.2, 0, 2.2),
      new THREE.Vector3(-1.2, 0, 1.95),
    ];

    var parachoquesPoints1 = [
      new THREE.Vector3(-1.9, 0.0, -1.7),
      new THREE.Vector3(-1.7, 0.0, -1.8),
      new THREE.Vector3(-1.2, 0.0, -1.8),
      new THREE.Vector3(-1.2, 0.0, -2),
      new THREE.Vector3(-0.8, 0.0, -2.4),
      new THREE.Vector3(0.0, 0.0, -2.4),
      new THREE.Vector3(0.8, 0.0, -2.4),
      new THREE.Vector3(1.2, 0.0, -2),
      new THREE.Vector3(1.2, 0.0, -1.8),
      new THREE.Vector3(1.7, 0.0, -1.8),
      new THREE.Vector3(1.9, 0.0, -1.7),
    ];

    const pathParachoques = new THREE.CatmullRomCurve3(
      parachoquesPoints,
      false
    );
    const pathParachoques1 = new THREE.CatmullRomCurve3(
      parachoquesPoints1,
      false
    );

    var extrudeSettingsParachoques = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: pathParachoques,
    };
    var extrudeSettingsParachoques1 = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: pathParachoques1,
    };

    this.parachoquesGeom = new THREE.ExtrudeGeometry(
      this.parachoquesShape,
      extrudeSettingsParachoques
    );
    this.parachoques = new THREE.Mesh(this.parachoquesGeom, this.metalPrimario);
    this.parachoquesGeom1 = new THREE.ExtrudeGeometry(
      this.parachoquesShape1,
      extrudeSettingsParachoques1
    );
    this.parachoques1 = new THREE.Mesh(
      this.parachoquesGeom1,
      this.metalPrimario
    );

    this.add(this.parachoques);
    this.add(this.parachoques1);
  }

  crearFocos() {
    this.focoIntGeom = new THREE.SphereGeometry(0.1, 20, 20);
    this.focoExtGeom = new THREE.SphereGeometry(0.15, 20, 20);
    this.cuboGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    this.interiorFoco = new THREE.Mesh(this.focoIntGeom, this.materialFoco);
    this.exteriorFoco = new THREE.Mesh(this.focoExtGeom, this.metalPrimario);

    this.cubo = new THREE.Mesh(this.cuboGeom, this.metalGris);
    this.cubo.position.set(0, 0, 0.15);
    this.cubo.rotateX(THREE.MathUtils.degToRad(30));

    var focoCSG = new CSG();
    focoCSG.subtract([this.exteriorFoco, this.cubo, this.interiorFoco]);
    this.foco = focoCSG.toMesh();
    this.foco.add(this.interiorFoco);

    // this.luzfoco = new THREE.SpotLight(0xffff00, 50);

    // const targetPosition = new THREE.Vector3(0, 0, 10);
    // this.luzfoco.position.set(0, 0, 0.05);
    // this.luzfoco.target.position.copy(targetPosition);
    // const helper = new THREE.DirectionalLightHelper(this.luzfoco, 5);

    // this.luzfoco2 = this.luzfoco.clone();
    // this.luzfoco2.position.set(0, 0, 0.05);
    // const helper2 = new THREE.DirectionalLightHelper(this.luzfoco2, 5);
    // this.foco.add(this.luzfoco);
    // this.foco2.add(this.luzfoco2);
    // this.add(helper);
    // this.add(helper2);

    this.foco2 = this.foco.clone();
    this.foco.position.set(-0.5, 0.5, 2.35);
    this.foco2.position.set(0.5, 0.5, 2.35);
    
    this.add(this.foco);
    this.add(this.foco2);
  }

  crearVolante() {
    this.unionsoporteVolanteGeom = new THREE.BoxGeometry(0.5, 0.15, 1.6);
    this.unionsoporte = new THREE.Mesh(
      this.unionsoporteVolanteGeom,
      this.metalNegro
    );
    this.unionsoporte.position.set(0, 0.14, 2.1);

    this.soporteVolanteGeom = new THREE.BoxGeometry(0.6, 0.9, 0.5);
    this.soporte = new THREE.Mesh(this.soporteVolanteGeom, this.metalNegro);
    this.soporte.position.set(0, 0.3, 1.4);

    var soporteHueco = new THREE.Mesh(this.soporteVolanteGeom, this.metalNegro);
    soporteHueco.position.set(0, 0.9, 1.6);
    soporteHueco.rotateX(THREE.MathUtils.degToRad(-60));

    this.ejeVolanteGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 20, 20);
    this.ejeVolante = new THREE.Mesh(this.ejeVolanteGeom, this.metalGris);
    this.ejeVolante.rotateX(THREE.MathUtils.degToRad(90));
    this.ejeVolante.position.set(0, 0.6, 1);
    this.add(this.ejeVolante);

    this.volanteGeom = new THREE.BoxGeometry(0.3, 0.2, 0.1);
    this.volante = new THREE.Mesh(this.volanteGeom, this.metalPrimario);
    this.volante.position.set(0, 0.6, 0.8);
    this.add(this.volante);

    this.ejeDireccionGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 20, 20);
    this.ejeDireccion = new THREE.Mesh(this.ejeDireccionGeom, this.metalGris);
    this.ejeDireccion.rotateZ(THREE.MathUtils.degToRad(90));
    this.ejeDireccion.position.set(0, 0.1, 1.4);
    this.add(this.ejeDireccion);

    const mangoVolantePoints = [
      new THREE.Vector3(0.5, 0.3, 0),
      new THREE.Vector3(0.5, 0.6, 0),
      new THREE.Vector3(0, 0.7, 0),
      new THREE.Vector3(-0.5, 0.6, 0),
      new THREE.Vector3(-0.5, 0.3, 0),
    ];

    this.botonVerdeGeom = new THREE.BoxGeometry(0.07, 0.05, 0.05);
    this.botonVerde = new THREE.Mesh(
      this.botonVerdeGeom,
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.botonVerde1 = this.botonVerde.clone();
    this.botonVerde.position.set(0.05, 0.05, -0.04);
    this.botonVerde1.position.set(0.05, -0.05, -0.04);

    this.botonRojoGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 15, 15);
    this.botonRojo = new THREE.Mesh(
      this.botonRojoGeom,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.botonRojo.rotateX(THREE.MathUtils.degToRad(90));
    this.botonRojo.position.set(-0.08, 0.03, -0.04);

    this.volante.add(this.botonRojo);
    this.volante.add(this.botonVerde);
    this.volante.add(this.botonVerde1);

    const pathMangoVolante = new THREE.CatmullRomCurve3(
      mangoVolantePoints,
      false,
      "catmullrom",
      0.5
    );
    const extrudeSettingsMangoVolante = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: pathMangoVolante,
    };
    const mangoVolanteGeom = new THREE.ExtrudeGeometry(
      this.circleShape,
      extrudeSettingsMangoVolante
    );

    this.mangoVolante = new THREE.Mesh(mangoVolanteGeom, this.metalNegro);
    this.mangoVolante.scale.set(0.75, 0.75, 0.75);
    this.mangoVolante.position.set(0, -0.4, 0);

    this.volante.add(this.mangoVolante);

    this.soporteCSG = new CSG();
    this.soporteCSG.subtract([this.soporte, soporteHueco]);
    this.soporte = this.soporteCSG.toMesh();

    this.add(this.soporte);
    this.add(this.unionsoporte);
  }

  crearChasis() {
    const chasisLargoPoints = [
      new THREE.Vector3(0.6, 0, -2.6),
      new THREE.Vector3(0.4, 0.8, -1.8),
      new THREE.Vector3(0.6, 1.2, -1),
      new THREE.Vector3(0.6, 1.2, 0.6),
      new THREE.Vector3(0.8, 1.0, 1.2),
      new THREE.Vector3(0.6, 0, 2),
      new THREE.Vector3(0.6, 0, 2.4),
    ];

    const pieza1points = [
      new THREE.Vector3(-0.8, 0, -1.8),
      new THREE.Vector3(-0.4, 0.8, -1.8),
    ];

    const pieza2points = [
        new THREE.Vector3(1, 0, -0.8),
        new THREE.Vector3(1, 1.2, -0.6),
    ];
    
    const pieza3points = [
        new THREE.Vector3(-0.6, 0, -0.8),
        new THREE.Vector3(-0.6, 1.2, -0.6),
    ];
    
    const pieza4points = [
        new THREE.Vector3(-1.2, 0, -0.8),
        new THREE.Vector3(-0.6, 1.2, -0.6),
    ];
    
    const pieza5points = [
        new THREE.Vector3(-1.2, 0, -0.8),
        new THREE.Vector3(-1.2, 1, -0.8),
    ];
    
    const pieza6points = [
        new THREE.Vector3(1, 1.3, -0.6),
        new THREE.Vector3(1, 1.3, 0.6),
    ];
    
    const pieza7points = [
        new THREE.Vector3(-0.6, 1.3, -0.6),
        new THREE.Vector3(-0.6, 1.3, 0.6),
    ];
    
    const pieza8points = [
        new THREE.Vector3(-1.2, 1.1, 0.8),
        new THREE.Vector3(-1.2, 1.1, -0.8),
    ];
    
    const pieza9points = [
        new THREE.Vector3(-2, 0, 0.6),
        new THREE.Vector3(-2, 0, -0.6),
    ];
    
    const pieza10points = [
        new THREE.Vector3(1.8, 0.9, -0.4),
        new THREE.Vector3(1.8, 0.9, 0.4),
    ];
    
    const pieza11points = [
        new THREE.Vector3(-1.2, 1.0, 0.8),
        new THREE.Vector3(-2, 0, -0.6)
    ];

    const pieza12points = [
        new THREE.Vector3(-1.2, 1.0, -0.8),
        new THREE.Vector3(-2, 0, 0.6)
    ];

    const pathPieza2 = new THREE.CatmullRomCurve3(
      pieza2points,
      false,
      "catmullrom",
      0
    );
    const pathPieza3 = new THREE.CatmullRomCurve3(
      pieza3points,
      false,
      "catmullrom",
      0
    );
    const pathPieza4 = new THREE.CatmullRomCurve3(
      pieza4points,
      false,
      "catmullrom",
      0
    );
    const pathPieza5 = new THREE.CatmullRomCurve3(
      pieza5points,
      false,
      "catmullrom",
      0
    );
    const pathPieza6 = new THREE.CatmullRomCurve3(
      pieza6points,
      false,
      "catmullrom",
      0
    );
    const pathPieza7 = new THREE.CatmullRomCurve3(
      pieza7points,
      false,
      "catmullrom",
      0
    );
    const pathPieza8 = new THREE.CatmullRomCurve3(
      pieza8points,
      false,
      "catmullrom",
      0
    );
    const pathPieza9 = new THREE.CatmullRomCurve3(
      pieza9points,
      false,
      "catmullrom",
      0
    );
    const pathPieza10 = new THREE.CatmullRomCurve3(
      pieza10points,
      false,
      "catmullrom",
      0
    );
    const pathPieza11 = new THREE.CatmullRomCurve3(
      pieza11points,
      false,
      "catmullrom",
      0
    );
    const pathPieza12 = new THREE.CatmullRomCurve3(
      pieza12points,
      false,
      "catmullrom",
      0
    );

    const pieza2Geom = new THREE.TubeGeometry(pathPieza2, 10, 0.05, 20);
    const pieza3Geom = new THREE.TubeGeometry(pathPieza3, 10, 0.05, 20);
    const pieza4Geom = new THREE.TubeGeometry(pathPieza4, 10, 0.05, 20);
    const pieza5Geom = new THREE.TubeGeometry(pathPieza5, 10, 0.05, 20);
    const pieza6Geom = new THREE.TubeGeometry(pathPieza6, 10, 0.05, 20);
    const pieza7Geom = new THREE.TubeGeometry(pathPieza7, 10, 0.05, 20);
    const pieza8Geom = new THREE.TubeGeometry(pathPieza8, 10, 0.05, 20);
    const pieza9Geom = new THREE.TubeGeometry(pathPieza9, 10, 0.05, 20);
    const pieza10Geom = new THREE.TubeGeometry(pathPieza10, 10, 0.05, 20);
    const pieza11Geom = new THREE.TubeGeometry(pathPieza11, 10, 0.05, 20);
    const pieza12Geom = new THREE.TubeGeometry(pathPieza12, 10, 0.05, 20);

    this.chasispieza2 = new THREE.Mesh(pieza2Geom, this.metalGris);
    this.chasispieza3 = new THREE.Mesh(pieza3Geom, this.metalGris);
    this.chasispieza4 = new THREE.Mesh(pieza4Geom, this.metalGris);
    this.chasispieza5 = new THREE.Mesh(pieza5Geom, this.metalGris);
    this.chasispieza6 = new THREE.Mesh(pieza6Geom, this.metalGris);
    this.chasispieza7 = new THREE.Mesh(pieza7Geom, this.metalGris);
    this.chasispieza8 = new THREE.Mesh(pieza8Geom, this.metalGris);
    this.chasispieza9 = new THREE.Mesh(pieza9Geom, this.metalGris);
    this.chasispieza10 = new THREE.Mesh(pieza10Geom, this.metalGris);
    this.chasispieza11 = new THREE.Mesh(pieza11Geom, this.metalGris);
    this.chasispieza12 = new THREE.Mesh(pieza12Geom, this.metalGris);

    const pathChasisLargo = new THREE.CatmullRomCurve3(
      chasisLargoPoints,
      false,
      "catmullrom",
      0
    );
    const pathpieza1 = new THREE.CatmullRomCurve3(
      pieza1points,
      false,
      "catmullrom",
      0
    );

    var chasisLargoGeom = new THREE.TubeGeometry(pathChasisLargo, 100, 0.05, 20);
    var pieza1geom = new THREE.TubeGeometry(pathpieza1, 100, 0.05, 20);

    chasisLargoGeom.rotateY(THREE.MathUtils.degToRad(-90));
    this.chasisLargo1 = new THREE.Mesh(chasisLargoGeom, this.metalGris);
    this.chasisLargo1.position.set(0, 0.1, 0);
    pieza1geom.rotateY(THREE.MathUtils.degToRad(-90));
    this.chasispieza1 = new THREE.Mesh(pieza1geom, this.metalGris);

    this.chasisLargo1.add(this.chasispieza1);
    this.chasisLargo1.add(this.chasispieza2);
    this.chasisLargo1.add(this.chasispieza3);
    this.chasisLargo1.add(this.chasispieza4);
    this.chasisLargo1.add(this.chasispieza5);

    this.chasisLargo2 = this.chasisLargo1.clone();
    this.chasisLargo2.scale.z *= -1;
    this.chasispieza9.position.set(0, 0.1, 0);

    this.base.add(this.chasispieza6);
    this.base.add(this.chasispieza7);
    this.base.add(this.chasispieza8);
    this.base.add(this.chasispieza9);
    this.base.add(this.chasispieza10);
    this.base.add(this.chasispieza11);
    this.base.add(this.chasispieza12);
    this.base.add(this.chasisLargo1);
    this.base.add(this.chasisLargo2);
  }


  cargarModelos() {
    const self = this;

    const mtlLoader = new MTLLoader();
    var mtlPath = "../models/rueda/disk.mtl";

    mtlLoader.load(mtlPath, function (materials) {
      materials.preload();

      const objLoader = new OBJLoader();

      objLoader.setMaterials(materials);

      const objPath = "../models/rueda/disk.obj";

      objLoader.load(objPath, function (rueda) {
        rueda.scale.set(0.2, 0.2, 0.3);
        //rueda.position.set(1.4, 0.05, 1.4);

        self.base.add(rueda);

        const rueda2 = rueda.clone();
        const rueda3 = rueda.clone();
        const rueda4 = rueda.clone();

        rueda2.scale.set(0.2, 0.2, -0.3);
        rueda3.scale.set(0.3, 0.3, 0.3);
        rueda4.scale.set(0.3, 0.3, -0.3);

        //Rueda de repuesto
        // const rueda5 = rueda.clone();
        // rueda5.scale.set(0.2, 0.2, 0.2);
        // rueda5.rotateX(THREE.MathUtils.degToRad(-90));
        // rueda5.position.set(-1.8, 0.9, 0);
        // self.base.add(rueda5);

        //rueda2.position.set(1.4, 0.05, -1.4);
        //rueda3.position.set(-0.8, 0.35, 1.7);
        //rueda4.position.set(-0.8, 0.35, -1.7);

        rueda.position.set(0, 0, 0.4);
        rueda2.position.set(0, 0, -0.4);
        rueda3.position.set(0, 0, 0.4);
        rueda4.position.set(0, 0, -0.4);

        self.base.add(rueda);
        self.base.add(rueda2);
        self.base.add(rueda3);
        self.base.add(rueda4);

        self.ejerueda1.add(rueda);
        self.ejerueda2.add(rueda2);
        self.ejerueda3.add(rueda3);
        self.ejerueda4.add(rueda4);
        
      });
    });

    mtlPath = "../models/conductor/cool.mtl";

    mtlLoader.load(mtlPath, function (materials) {
      materials.preload();

      const objLoader = new OBJLoader();

      objLoader.setMaterials(materials);

      const objPath = "../models/conductor/cool.obj";

      objLoader.load(objPath, function (conductor) {
        conductor.scale.set(1.1, 1.1, 1.1);
        conductor.position.set(0, -0.1, 0.35);

        self.add(conductor);
      });
    });
  }

  update() {
  
    if(this.motor.motorEncendido){
      this.ejerueda1.rotateZ(THREE.MathUtils.degToRad(-10));
      this.ejerueda2.rotateZ(THREE.MathUtils.degToRad(-10));
      this.ejerueda3.rotateZ(THREE.MathUtils.degToRad(-10));
      this.ejerueda4.rotateZ(THREE.MathUtils.degToRad(-10));
    }

    this.motor.update();
    this.minigun.update();
  }
}
export { Coche };
