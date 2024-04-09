import * as THREE from "../libs/three.module.js";
import { CSG } from "../libs/CSG-v2.js";

class ObjetoExamen extends THREE.Object3D {
  constructor() {
    super();

// CSG-v2.js presenta errores en los siguientes casos:
// Con figuras por revolución que tocan el eje Y
// ⋆ Evitad tocar el eje Y, aunque os acerquéis mucho (X=0.001)
// Con los conos
// ⋆ Usad cilindros con un radio pequeño (>0) en uno de sus extremos
// Con figuras que incluyan un Shape con absarc o absellipse

    const material = new THREE.MeshNormalMaterial();

    const extrudeSettings1 = {
      steps: 1,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 20,
    };

    const points = [];
    points.push(new THREE.Vector2(-10, 0.01));
    points.push(new THREE.Vector2(-5, 10));
    points.push(new THREE.Vector2(0.01, 5));
    points.push(new THREE.Vector2(10, 5));

    //Hacer shape a partir de un spline
    var spline = new THREE.SplineCurve(points);
    var shape = new THREE.Shape(spline.getPoints(50));
    var shapeCircle = new THREE.Shape();

    //Hacer agujeros en un shape con absarc y absellipse
    const radius = 2;
    const startAngle = 0;
    const endAngle = Math.PI * 2;

    //shapeCircle.absarc(-4,5, radius, startAngle, endAngle, false);
    shapeCircle.absellipse(-4 ,6,2 ,3 ,0, Math.PI* 2);
    var geometryCircle = new THREE.ShapeGeometry(shapeCircle);
    this.circle = new THREE.Mesh(geometryCircle, material);
    //this.add(this.circle);

    shape.holes.push(shapeCircle);

    var shapeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings1);
    this.objeto4 = new THREE.Mesh(shapeGeom, material);

    //this.add(this.objeto4);

    //*******************************************

    const shape1 = new THREE.Shape();
    shape1.moveTo(0, 0);
    shape1.moveTo(0, 5);
    //shape1.splineThru([new THREE.Vector2(0,5),new THREE.Vector2(4,4),new THREE.Vector2(5 , 0) ] ) ;
    shape1.quadraticCurveTo(6, 6, 5, 0);
    shape1.lineTo(0, 0);


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

  rotateShape(aShape , angle , res = 6 , center = new THREE. Vector2 (0 ,0) ) {
    var points = aShape . extractPoints(res).shape ; // Extraemos los puntos 2D del shape
    points.forEach((p) => {
    p.rotateAround(center,angle ) ; //Los giramos
    } );
    return new THREE.Shape(points) ; // Construimos y devolvemos un nuevo shape
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
}
export { ObjetoExamen };
