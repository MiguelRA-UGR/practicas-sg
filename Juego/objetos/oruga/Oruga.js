import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

class Oruga extends THREE.Object3D {
    constructor() {
        super();

		this.crearMateriales();

		this.crearCabeza();
		this.crearSeccion();

		this.seccion2 = this.seccion.clone();
		this.seccion3 = this.seccion.clone();
		this.seccion4 = this.seccion.clone();
		this.seccion5 = this.seccion.clone();
		this.seccion6 = this.seccion.clone();
		this.seccion7 = this.seccion.clone();

		this.seccion2.position.set(0,0,-1);
		this.seccion3.position.set(0,0,-2);
		this.seccion4.position.set(0,0,-3);
		this.seccion5.position.set(0,0,-4);
		this.seccion6.position.set(0,0,-5);
		this.seccion7.position.set(0,0,-6);

		this.seccion2.scale.set(0.95,0.95,0.95);
		this.seccion3.scale.set(0.90,0.90,0.90);
		this.seccion4.scale.set(0.85,0.85,0.85);
		this.seccion5.scale.set(0.80,0.80,0.80);
		this.seccion6.scale.set(0.75,0.75,0.75);
		this.seccion7.scale.set(0.70,0.70,0.70);

		this.seccion.add(this.seccion2);
		this.seccion.add(this.seccion3);
		this.seccion.add(this.seccion4);
		this.seccion.add(this.seccion5);
		this.seccion.add(this.seccion6);
		this.seccion.add(this.seccion7);


        this.add(this.cuerpo);
    };

	crearSeccion(){
		this.seccionGeom = new THREE.SphereGeometry();
	
		this.seccion = new THREE.Mesh(this.seccionGeom, this.materialTextura);
		this.seccion.scale.set(0.9,1,1);
		this.seccion.rotateZ(THREE.MathUtils.degToRad(90))
		this.seccion.rotateY(THREE.MathUtils.degToRad(90))
		
		this.huecoGeom = new THREE.BoxGeometry(2,1,3);
		this.hueco = new THREE.Mesh(this.huecoGeom, this.materialPrincipal);
		this.hueco.position.set(0,-0.5,0);

		this.arribaCSG = new CSG();
		this.arribaCSG.subtract([this.seccion, this.hueco]);
		this.seccion = this.arribaCSG.toMesh();

		this.seccionAbajo = new THREE.Mesh(this.seccionGeom,this.materialPrincipal);
		this.seccionAbajo.scale.set(0.9,1,1);
		this.seccionAbajo.rotateZ(THREE.MathUtils.degToRad(90))
		this.seccionAbajo.rotateY(THREE.MathUtils.degToRad(90))

		this.hueco2 = this.hueco.clone();
		this.hueco2.position.set(0,0.5,0);

		this.abajoCSG = new CSG();
		this.abajoCSG.subtract([this.seccionAbajo, this.hueco2]);
		this.seccionAbajo = this.abajoCSG.toMesh();

		this.pata = new THREE.Mesh(this.seccionGeom, this.materialTextura2);
		this.pata.scale.set(0.2,0.4,0.2);
		this.pata.rotateZ(THREE.MathUtils.degToRad(30))
		this.pata.position.set(0.8,-0.7,0);

		this.pata2 = this.pata.clone();
		this.pata2.rotateZ(THREE.MathUtils.degToRad(-60))
		this.pata2.position.set(-0.8,-0.7,0);

		this.seccionAbajo.add(this.pata);
		this.seccionAbajo.add(this.pata2);

		this.seccion.add(this.seccionAbajo);
		this.add(this.seccion);
	}

	crearMateriales(){
		var textureLoader = new THREE.TextureLoader();
        var texture1 = textureLoader.load('../../imgs/oruga.png');
		var texture2 = textureLoader.load('../../imgs/pataOruga.png');

        this.materialTextura = new THREE.MeshPhongMaterial({
			map: texture1,
            specular: 0x222222,
            shininess: 100,
        });

		this.materialTextura2 = new THREE.MeshPhongMaterial({
			color: 0xff0000,
            specular: 0x222222,
            shininess: 100,
        });

		this.materialPrincipal = new THREE.MeshPhongMaterial({
			color: 0xffff6e,
            specular: 0x222222,
            shininess: 100,
        });
	}

    
	crearCabeza() {
       
    }

	update() {

    }
    
} export { Oruga };
