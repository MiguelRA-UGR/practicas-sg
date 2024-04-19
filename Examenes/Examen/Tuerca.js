import * as THREE from '../../Juego/libs/three.module.js';
import { CSG } from '../../Juego/libs/CSG-v2.js';

class Tuerca extends THREE.Object3D {
    constructor(tipo) {
        super();
    
        const material = new THREE.MeshNormalMaterial();
        this.geomCilindro = new THREE.CylinderGeometry(3,3,1,6);
        this.mesh = new THREE.Mesh(this.geomCilindro,material);

        this.conoGeom = new THREE.CylinderGeometry(0.0001,3.6,4,30,30);
        this.cone = new THREE.Mesh(this.conoGeom,material);
        this.cone.position.set(0,1.45,0);
        this.csg = new CSG();

        this.csg.intersect([this.cone, this.mesh]);
        this.mesh = this.csg.toMesh();

        this.cone2 = this.cone.clone();
        this.cone2.scale.y *=-1;
        this.cone2.position.set(0,-1.45,0)

        const rTop = 0.1;
        const rBtm = 0.1;
        const R = 1.5; // radius of the spiral
        const T = 9; // twists of the spiral
        const heightSegments = 300;
        const radialSegments = 10;
        const slope = 1.5;
        let s = 0;
        const geometry = new THREE.CylinderGeometry( rTop, rBtm, T * Math.PI * 2, radialSegments, heightSegments, true );
        const position = geometry.attributes.position;
        geometry.translate( R, T * Math.PI, 0 );
        const v = new THREE.Vector3( );
        const w = new THREE.Vector3( );

        for( let i = 0 ; i < position.count; i++ ) {
            
            s = i % ( radialSegments + 1 ) === 0 ? s + radialSegments + 1 : s; // slope
            v.fromBufferAttribute( position, i );	
            position.setXYZ( i,  Math.cos( v.y ) * v.x,  Math.sin( v.y ) * v.x, v.z + slope * s / heightSegments / radialSegments );
            
        }

        v.fromBufferAttribute( position, 0 );
        w.fromBufferAttribute( position,  position.count - 1 );
        geometry.translate( 0, 0, - ( w.z - v.z ) / 2 );
        geometry.computeVertexNormals( );

        const espiral = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, wireframe: false } ) );
        //this.add( espiral );

        this.centroGeom = new THREE.CylinderGeometry(1.54,1.54,2,20,20);
        this.centro = new THREE.Mesh(this.centroGeom,material);
        espiral.rotateX(THREE.MathUtils.degToRad(90));

        this.csg2 = new CSG();
        this.csg2.union([this.centro, espiral]);
        this.centro = this.csg2.toMesh();


        this.csg3 = new CSG();
        this.csg3.subtract([this.mesh, this.cone2,this.centro]);
        this.mesh = this.csg3.toMesh();

        //this.add(this.centro);
        this.add(this.mesh);
    }

} export { Tuerca };