import * as THREE from "../libs/three.module.js";
import { CSG } from "../libs/CSG-v2.js";

class ObjetoExamen extends THREE.Object3D {
  constructor() {
    super();
    this.crearMateriales();

    const shape1 = new THREE.Shape();
    shape1.moveTo(0, 0);
    shape1.moveTo(0, 5);
    shape1.quadraticCurveTo(6, 6, 5, 0);
    shape1.lineTo(0, 0);

    const extrudeSettings1 = {
      steps: 1,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 20,
    };

    const material = new THREE.MeshNormalMaterial();

    var geom1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings1);
    geom1.center();
    var geom = this.createBoxWithRoundedEdges(7, 10, 5, 0.5, 5);

    this.objeto1 = new THREE.Mesh(geom1, material);
    this.objeto2 = new THREE.Mesh(geom, material);

    this.objeto2.rotateZ(THREE.MathUtils.degToRad(85));
    this.objeto2.position.set(0,1.5,0);

    var objeto3geom = this.createBoxWithRoundedEdges(1.75,1.5,9,0.6,5);
    this.objeto3 = new THREE.Mesh(objeto3geom, material);
    this.objeto3.scale.set(1,1,4);

    var esferaGeom = new THREE.SphereGeometry(0.6,20,20);
    this.esfera = new THREE.Mesh(esferaGeom,material);

    this.esfera.scale.set(2,1,1);

    this.esfera.position.set(0,-2,0);

    var boxGeom = new THREE.BoxGeometry(8,2,5);
    this.cubo = new THREE.Mesh(boxGeom, material);
    this.cubo.position.set(0,-3.5,0);

    var principalCSG = new CSG();
    principalCSG.subtract([this.objeto1, this.cubo, this.objeto2,this.objeto3,this.esfera]);
    this.objeto1 = principalCSG.toMesh();


    this.add(this.objeto1);
    //this.add(this.esfera);
    //this.add(this.objeto3);
  }

  update() {}

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

  crearMateriales() {}
}
export { ObjetoExamen };
