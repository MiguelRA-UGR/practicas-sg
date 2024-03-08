import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Escorvispa extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();

        this.createGUI(gui);

        this.cuerpoGeom = new THREE.SphereGeometry(0.25, 32, 32);

		this.crearMateriales();

        this.cuerpoGeom.scale(1, 1.25,1 );
        this.cuerpoGeom.rotateX(THREE.MathUtils.degToRad(90))
        this.cuerpo = new THREE.Mesh(this.cuerpoGeom, this.materialPelo);

		this.createAlas();
        this.createPatas();
		this.createCabeza();
		this.createCola();
        this.createPinzas();

        this.add(this.cuerpo);
    };

	crearMateriales(){
		var textureLoader = new THREE.TextureLoader();
        var texture1 = textureLoader.load('../imgs/rayas.avif');

        this.beepionYellowMat = new THREE.MeshPhongMaterial({
            color: 0xffe400,
            specular: 0x222222,
            shininess: 100,
        });

        this.materialPelo = new THREE.MeshPhongMaterial({
            map : texture1,
            color: 0xFFFF00,
            specular: 0x222222,
            shininess: 100,
        });

		this.beepionBlackMat = new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0x222222,
            shininess: 100,
        });

		this.wingmaterial = new THREE.MeshBasicMaterial({ color: 0x80DAEB, transparent: true, opacity: 0.5, side: THREE.DoubleSide });

		
		var texture = textureLoader.load('../imgs/ojo2.avif');
		this.materialOjo = new THREE.MeshBasicMaterial({ map: texture });
	}

    createCola() {
        this.cola = new THREE.Mesh(this.cuerpoGeom, this.materialPelo);
        this.cola.scale.set(0.75, 0.75, 0.75);
        this.cola.position.set(0, 0, -0.4);
        this.cola.rotateX(THREE.MathUtils.degToRad(-20));
    
        this.cola2 = this.cola.clone();
        this.cola2.position.set(0, 0, -0.4);
        this.cola2.rotateX(THREE.MathUtils.degToRad(-20));
    
        this.cola3 = this.cola2.clone();
        this.cola3.position.set(0, 0, -0.4);
    
        this.cola2.add(this.cola3);
        this.cola.add(this.cola2);
        
    
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.3, 0.1, 0),
            new THREE.Vector3(0.45, 0.5, 0),
            new THREE.Vector3(0.4, 0.6, 0),
            new THREE.Vector3(0.3, 0.7, 0),
            new THREE.Vector3(0.1, 0.9, 0),
            new THREE.Vector3(0, 1, 0),
        ]);
    
        var points = curve.getPoints(50);
    
        var aquijonGeom = new THREE.LatheGeometry(points);
        this.aguijon = new THREE.Mesh(aquijonGeom, this.beepionBlackMat);

        this.aguijon.rotateX(THREE.MathUtils.degToRad(-90));
        this.aguijon.position.set(0,0,-0.);
        this.aguijon.scale.set(1.5,1.5,1.5);
    
        this.cola3.add(this.aguijon);

        this.cuerpo.add(this.cola);
    }
    
    createPinzas() {
        this.parte = new THREE.Mesh(this.cuerpoGeom, this.materialPelo);
        this.parte.rotateY(THREE.MathUtils.degToRad(50));
        this.parte.position.set(0.25,0,0.20);
        this.parte.scale.set(0.5,0.5,0.5);

        this.parte1 = this.parte.clone();
        this.parte1.scale.set(1.2,1.2,1.2);
        this.parte1.rotateY(THREE.MathUtils.degToRad(-40));
        this.parte1.rotateX(THREE.MathUtils.degToRad(40));
        this.parte1.position.set(0,-0.2,0.4);

        this.parte.add(this.parte1);

        this.cuerpo.add(this.parte);
    }

	createCabeza() {
        this.cabeza = new THREE.Mesh(this.cuerpoGeom, this.beepionYellowMat);
		this.cabeza2 = this.cabeza.clone();
		this.cabeza.scale.set(0.5,0.5,0.5);
		this.cabeza.position.set(0,0,0.4);
		this.cabeza.rotateX(THREE.MathUtils.degToRad(45));
		
		this.cabeza2.rotateY(THREE.MathUtils.degToRad(90));
		this.cabeza2.scale.set(1.3,1.3,1.3);
		this.cabeza2.position.set(0,0,-0.2);
		this.cabeza.add(this.cabeza2);

		this.ojo1 = new THREE.Mesh(this.cuerpoGeom, this.materialOjo);
		this.ojo1.scale.set(0.75,0.75,0.75);
		this.ojo2 = this.ojo1.clone();
		
		this.ojo1.position.set(-0.25,0.15,-0.1);
		this.ojo1.rotateY(THREE.MathUtils.degToRad(30));
		this.ojo1.rotateZ(THREE.MathUtils.degToRad(35));
		this.ojo2.position.set(0.25,0.15,-0.1);
		this.ojo2.rotateY(THREE.MathUtils.degToRad(-30));
		this.ojo2.rotateZ(THREE.MathUtils.degToRad(-35));

		this.tenazaGeom = new THREE.TorusGeometry(0.25, 0.05, 20, 20);
		this.tenaza = new THREE.Mesh(this.tenazaGeom, this.beepionBlackMat);
		this.tenaza.scale.set(0.7,1,0.7);
		this.tenaza.rotateX(THREE.MathUtils.degToRad(90));
		this.tenaza.position.set(0,0,0.3);
		
		var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
		var boxMesh = new THREE.Mesh(boxGeometry);
		boxMesh.position.set(0.5, 0, 0.5);
		var csg = new CSG();
		csg.subtract([this.tenaza, boxMesh]);
		this.tenaza1 = csg.toMesh();

		this.tenaza2 = this.tenaza1.clone();
		this.tenaza2.rotateZ(THREE.MathUtils.degToRad(180));

		this.tenaza1.position.set(-0.1, 0, 0);
        this.tenaza2.position.set(0.1, 0, 0);
		this.cabeza.add(this.tenaza2);
		this.cabeza.add(this.tenaza1);

		// Agregar los ojos a la cabeza
		this.cabeza.add(this.ojo1);
		this.cabeza.add(this.ojo2);
		this.cuerpo.add(this.cabeza);
    }

    createAlas() {
        // Alas
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(-2, 0));
        points.push(new THREE.Vector2(-2, -0.2));
        points.push(new THREE.Vector2(-1.6, -0.5));
        points.push(new THREE.Vector2(0, -0.2));

        const wingshape = new THREE.Shape(points);
        const winggeometry = new THREE.ShapeGeometry(wingshape);
        
        this.ala1 = new THREE.Mesh(winggeometry, this.wingmaterial);
        this.ala1.rotateX(THREE.MathUtils.degToRad(90));
        this.ala1.position.set(0, 0.15, 0.20);

        this.ala2 = this.ala1.clone();
        this.ala2.rotateY(THREE.MathUtils.degToRad(180));
        this.ala2.position.set(0, 0.15, 0.20);

        this.ala3 = this.ala1.clone();
        this.ala3.scale.set(0.8, 0.8, 0.8);
        this.ala3.rotateZ(THREE.MathUtils.degToRad(13))
        this.ala3.position.set(0, 0.15, 0);

        this.ala4 = this.ala3.clone();
        this.ala4.rotateY(THREE.MathUtils.degToRad(180));
        this.ala4.rotateZ(THREE.MathUtils.degToRad(26))
        this.ala4.position.set(0, 0.15, 0);

        this.cuerpo.add(this.ala1);
        this.cuerpo.add(this.ala2);
        this.cuerpo.add(this.ala3);
        this.cuerpo.add(this.ala4);
    }

    createPatas() {
        // Patas
        var path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.2, -0.25, 0),
            new THREE.Vector3(0.15, -0.30, 0),
            new THREE.Vector3(0.2, -0.35, 0)
        ]);

        var legShape = new THREE.Shape();
        legShape.moveTo(0.01, 0);
        legShape.lineTo(0.01, 0.02);
        legShape.lineTo(-0.01, 0.02);
        legShape.lineTo(-0.01, 0);
        legShape.lineTo(0.01, 0);

        var extrudeSettings = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: path
        };

        var leggeometry = new THREE.ExtrudeGeometry(legShape, extrudeSettings);
        leggeometry.scale(2, 2, 2);
        this.pata1 = new THREE.Mesh(leggeometry, this.beepionBlackMat);

        this.pata2 = this.pata1.clone();
        this.pata3 = this.pata1.clone();
        this.pata4 = this.pata1.clone();
        this.pata5 = this.pata1.clone();
        this.pata6 = this.pata1.clone();

        this.pata2.position.set(0, 0, 0.1);
        this.pata2.rotateY(THREE.MathUtils.degToRad(-20));
        this.pata3.position.set(0, 0, -0.1);
        this.pata3.rotateY(THREE.MathUtils.degToRad(20));
        this.pata4.rotateY(THREE.MathUtils.degToRad(180));
        this.pata5.position.set(0, 0, 0.1);
        this.pata5.rotateY(THREE.MathUtils.degToRad(200));
        this.pata6.position.set(0, 0, -0.1);
        this.pata6.rotateY(THREE.MathUtils.degToRad(160));

        this.cuerpo.add(this.pata1);
        this.cuerpo.add(this.pata2);
        this.cuerpo.add(this.pata3);
        this.cuerpo.add(this.pata4);
        this.cuerpo.add(this.pata5);
        this.cuerpo.add(this.pata6);
    }


	createGUI(gui) {
		this.guiControls = new function () {

		}
	};

	update() {
		
	}
} export { Escorvispa };
