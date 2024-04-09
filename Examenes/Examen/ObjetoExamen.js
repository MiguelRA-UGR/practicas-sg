import * as THREE from '../libs/three.module.js';
import { CSG } from '../libs/CSG-v2.js';

class ObjetoExamen extends THREE.Object3D {
    constructor(tipo) {
        super();
    
        const material = new THREE.MeshNormalMaterial();
        
        var objeto1geom = this.createBoxWithRoundedEdges(2,0.2,6,0.05,3);
        this.principal = new THREE.Mesh(objeto1geom,material);

        var shape1 = new THREE.Shape();
        shape1.moveTo(0, 0);
        shape1.lineTo(-1, 0);
        shape1.lineTo(-1, 2);
        shape1.quadraticCurveTo(-0.66, 2.66, 0, 2.66);
        shape1.quadraticCurveTo(0.66, 2.66, 1, 2);
        shape1.lineTo(1, 2);
        shape1.lineTo(1, 0);
        shape1.lineTo(0, 0);

        const extrudeSettings1 = {
            steps: 1,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 10,
          };

        var shapeGeom = new THREE.ExtrudeGeometry(shape1, extrudeSettings1);
        this.pieza = new THREE.Mesh(shapeGeom,material);

        this.pieza.scale.set(0.15,0.15,0.15);
        this.pieza.rotateY(THREE.MathUtils.degToRad(-90));
        this.pieza.rotateX(THREE.MathUtils.degToRad(-90));
        this.pieza.position.set(-1,0.17,0);

        var cilindroHuecoPequeñoGeom = new THREE.CylinderGeometry(0.1,0.1,1,15,15);
        this.cilindroPequeño = new THREE.Mesh(cilindroHuecoPequeñoGeom,material);
        this.cilindroPequeño2 = this.cilindroPequeño.clone()

        this.cilindroPequeño.position.set(-0.45,0,0.35);
        this.cilindroPequeño2.position.set(-0.45,0,-0.35);

        var principalCSG = new CSG();
        principalCSG.subtract([this.principal,this.pieza,this.cilindroPequeño,this.cilindroPequeño2]);

        this.principal = principalCSG.toMesh();


        var boxGeom= new THREE.BoxGeometry(2,2,4);
        var cylinderGeom = new THREE.CylinderGeometry(1,1,2,15,15);
        var cylinderGeom2 = new THREE.CylinderGeometry(1.5,1.5,2,15,15);

        this.piezaarriba = new THREE.Mesh(boxGeom,material);
        this.piezaarribaCilindro1 = new THREE.Mesh(cylinderGeom,material);
        this.piezaarribaCilindro1.position.set(0,0.5,-2);
        this.piezaarribaCilindro2 = new THREE.Mesh(cylinderGeom2,material);
        this.piezaarribaCilindro2.position.set(0,0.5,2);
        this.piezaarriba.position.set(0,0.5,0);

        var piezaarribaCSG = new CSG();
        piezaarribaCSG.union([this.piezaarriba, this.piezaarribaCilindro1,this.piezaarribaCilindro2]);
        this.piezaarriba= piezaarribaCSG.toMesh();
        this.piezaarriba.scale.set(0.2,0.2,0.2);
        this.piezaarriba.position.set(0.3,0,0);
        this.piezaarriba.rotateY(THREE.MathUtils.degToRad(-90));

        var huecoArribaGeom = new THREE.BoxGeometry(1.5,0.3,1);
        this.huecoArriba = new THREE.Mesh(huecoArribaGeom,material);
        this.huecoArriba.position.set(0.3,0.35,0);
        this.huecoArriba.rotateZ(THREE.MathUtils.degToRad(-8));

        var objetoHuecogeom = this.createBoxWithRoundedEdges(0.5,0.2,1,0.1,5);
        this.objetoHueco = new THREE.Mesh(objetoHuecogeom,material);
        this.objetoHueco.position.set(-1.1,0.1,0);
        this.objetoHueco.rotateY(THREE.MathUtils.degToRad(-90));
        
        var cilindroHuecoPequeñoGeom = new THREE.CylinderGeometry(0.1,0.1,1,15,15);
        this.cilindroPequeño = new THREE.Mesh(cilindroHuecoPequeñoGeom,material);
        this.cilindroPequeño2 = this.cilindroPequeño.clone()

        this.cilindroPequeño.position.set(-0.5,0,0.35);
        this.cilindroPequeño2.position.set(-0.5,0,-0.35);

        var piezaCSG = new CSG();
        piezaCSG.subtract([this.piezaarriba, this.huecoArriba,this.cilindroPequeño,this.cilindroPequeño2]);
        this.piezaarriba= piezaCSG.toMesh();

        var generalCSG = new CSG();
        generalCSG.union([this.principal,this.piezaarriba]);
        this.principal=generalCSG.toMesh();

        var cilindroHuecoGrandeGeom = new THREE.CylinderGeometry(0.12,0.12,1,15,15);
        this.cilindroGrande = new THREE.Mesh(cilindroHuecoGrandeGeom,material);
        this.cilindroGrande2 = this.cilindroGrande.clone()

        this.cilindroGrande.position.set(-0.75,0,0);
        this.cilindroGrande2.position.set(0.67,0,0);

        var boxInferiorGeom= new THREE.BoxGeometry(3,0.1,2);
        this.boxInferior = new THREE.Mesh(boxInferiorGeom,material);
        this.boxInferior.position.set(0,-0.1,0);
        //this.add(this.boxInferior);

        var generalCSG2 = new CSG();
        generalCSG2.subtract([this.principal,this.cilindroGrande,this.cilindroGrande2,this.boxInferior]);
        this.principal=generalCSG2.toMesh();

        this.add(this.principal);
    }

    createBoxWithRoundedEdges(width, height, depth, radius0, smoothness) {
        let shape = new THREE.Shape();
        let eps = 0.00001;
        let radius = radius0 - eps;
        shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
        shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
        shape.absarc(
          width - radius * 2,
          height - radius * 2,
          eps,
          Math.PI / 2,
          0,
          true
        );
        shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
        var geometry = new THREE.ExtrudeGeometry(shape, {
          amount: depth - radius0 * 2,
          bevelEnabled: true,
          bevelSegments: smoothness * 2,
          steps: 1,
          bevelSize: radius,
          bevelThickness: radius0,
          curveSegments: smoothness,
        });
    
        geometry.center();
    
        return geometry;
      }

} export { ObjetoExamen };