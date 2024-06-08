import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import { Physijs } from "../../libs/physi.module.js";

class Bala extends THREE.Object3D {
    constructor() {
        super();
        
        this.crearMateriales();

        this.cilindroGeom = new THREE.CylinderGeometry(0.25,0.25,1,10);
        this.casquillo = new Physijs.CylinderMesh(this.cilindroGeom,this.matFisico,20);

        // this.toroGeom = new THREE.TorusGeometry(0.25,0.025,10,10);
        // this.toro = new THREE.Mesh(this.toroGeom,this.materialCasquillo);
        // this.toro.rotateX(THREE.MathUtils.degToRad(90));
        // this.toro.position.set(0,0.43,0);

        // this.esferaPercGeom = new THREE.SphereGeometry(0.05,10,10);
        // this.esferaPerc = new THREE.Mesh(this.esferaPercGeom,this.materialCasquillo);
        // this.esferaPerc.position.set(0,0.5,0);

        // var casquilloCSG = new CSG();
        // casquilloCSG.subtract([this.casquillo, this.toro, this.esferaPerc]);
        // this.casquillo = casquilloCSG.toMesh();

        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.25, 0.0, 0),
            new THREE.Vector3(0.1, 0.35, 0),
            new THREE.Vector3(0.0, 0.38, 0),
        ]);
    
        var points = curve.getPoints(50);
    
        this.puntaGeom = new THREE.LatheGeometry(points,10);
        this.punta = new THREE.Mesh(this.puntaGeom, this.materialPunta);
        this.punta.position.set(0,0.5,0);

        this.casquillo.rotateX(THREE.MathUtils.degToRad(180));
        this.add(this.casquillo);
        this.add(this.punta);

        //this.casquillo.visible = false;
    };

	crearMateriales(){
        this.materialCasquillo = new THREE.MeshStandardMaterial({
            color: 0xCDA434,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        });

        this.matFisico = Physijs.createMaterial ( this.materialCasquillo , 0.9 , 0.3) ;


        this.materialPunta = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        });
	}

    

    cargarModelos() {

    }
    
	update() {

    }
    
} export { Bala };











