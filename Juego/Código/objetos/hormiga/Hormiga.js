import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

class Hormiga extends THREE.Object3D {
    constructor(tipo) {
        super();

        //Variables para animacion
        this.tipo = tipo;
        this.batirarriba=false;
        this.velocidadbatida=0.05;
        this.margenbatida=0.1;
        this.valorbatida = 0;

        this.movimiento=false;
        this.velocidadmovimienton=0.0005;
        this.margenmovimiento=0.01;
        this.valormovimiento = 0;

        this.cuerpoGeom = new THREE.SphereGeometry(0.25, 32, 32);

		this.crearMateriales();

        this.cuerpoGeom.rotateX(THREE.MathUtils.degToRad(90))
        this.cuerpo = new THREE.Mesh(this.cuerpoGeom, this.materialPrincipal);
        
        this.createPatas();
		this.createCabeza();
        this.createCola();

        this.cuerpo.scale.set(0.6,0.6,0.75)

        this.add(this.cuerpo);

        
    };

	crearMateriales(){
		var textureLoader = new THREE.TextureLoader();
        var texture1 = textureLoader.load('../imgs/stripes.jpg');

        this.colorPrincipal = 0x582900;

        this.materialPrincipal = new THREE.MeshPhongMaterial({
            color: this.colorPrincipal,
            specular: 0x222222,
            shininess: 100,
        });

        this.materialRayas = new THREE.MeshPhongMaterial({
            map : texture1,
            color: 0xd3691f,
            specular: 0x222222,
            shininess: 100,
            transparent: true,
            opacity:0.9
        });

		this.materialNegro = new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0x222222,
            shininess: 100,
        });

		this.wingmaterial = new THREE.MeshBasicMaterial({ color: 0x80DAEB, transparent: true, opacity: 0.5, side: THREE.DoubleSide });

	}
    
	createCabeza() {
        this.cabeza = new THREE.Mesh(this.cuerpoGeom, this.materialPrincipal);
		this.cabeza2 = this.cabeza.clone();
		this.cabeza.scale.set(0.5,0.5,0.5);
		this.cabeza.position.set(0,0,0.4);
		this.cabeza.rotateX(THREE.MathUtils.degToRad(45));
		
		this.cabeza2.rotateY(THREE.MathUtils.degToRad(90));
		this.cabeza2.scale.set(1.3,1.3,1.3);
		this.cabeza2.position.set(0,0,-0.2);
		this.cabeza.add(this.cabeza2);

		this.ojo1 = new THREE.Mesh(this.cuerpoGeom, this.materialNegro);
		this.ojo1.scale.set(0.4,0.4,0.4);
		this.ojo2 = this.ojo1.clone();
		
		this.ojo1.position.set(-0.25,0.15,-0.1);
		this.ojo1.rotateY(THREE.MathUtils.degToRad(30));
		this.ojo1.rotateZ(THREE.MathUtils.degToRad(35));
		this.ojo2.position.set(0.25,0.15,-0.1);
		this.ojo2.rotateY(THREE.MathUtils.degToRad(-30));
		this.ojo2.rotateZ(THREE.MathUtils.degToRad(-35));

		this.tenazaGeom = new THREE.TorusGeometry(0.25, 0.05, 20, 20);
		this.tenaza = new THREE.Mesh(this.tenazaGeom, this.materialNegro);
		this.tenaza.scale.set(0.7,1,0.7);
		this.tenaza.rotateX(THREE.MathUtils.degToRad(90));
		this.tenaza.position.set(0,0,0.1);
		
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

        //Antenas

        var path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.3, 0.8, 0),
            new THREE.Vector3(0.5, 0.8, 0),
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

        var antenageom = new THREE.ExtrudeGeometry(legShape, extrudeSettings);
        this.antena1 = new THREE.Mesh(antenageom, this.materialNegro);
        this.antena1.position.set(0.2,0.2,-0.3);
        this.antena2 = this.antena1.clone();
        this.antena2.position.set(-0.2,0.2,-0.3);
        this.antena2.rotateY(THREE.MathUtils.degToRad(180))

        this.cabeza.add(this.antena1);
        this.cabeza.add(this.antena2);
		this.cabeza.add(this.ojo1);
		this.cabeza.add(this.ojo2);
		this.add(this.cabeza);

        this.scale.set(2,2,2);
        this.translateY(1.5);
    }

    createCola(){
        this.cola = new THREE.Mesh(this.cuerpoGeom,this.materialRayas);

        this.cola.position.set(0,0,-0.5);
        this.cola.scale.set(1,1,1.5);
        this.cola.rotateZ(Math.PI/2)

        this.add(this.cola);
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
        this.pata1 = new THREE.Mesh(leggeometry, this.materialNegro);

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

        this.add(this.pata1);
        this.add(this.pata2);
        this.add(this.pata3);
        this.add(this.pata4);
        this.add(this.pata5);
        this.add(this.pata6);
    }

	update() {
        const rotationSpeed = 0.05;
    
        const maxRotationAngle = THREE.MathUtils.degToRad(10);
    
        this.valormovimiento += rotationSpeed;
        const rotationAngle = Math.sin(this.valormovimiento) * maxRotationAngle;
        
        this.tenaza1.rotateY(rotationAngle/20);
        this.tenaza2.rotateY(rotationAngle/20);

        this.antena1.rotateZ(rotationAngle/30);
        this.antena2.rotateZ(rotationAngle/30);

        this.cola.rotateY(-rotationAngle/20);
        this.cola.translateX(rotationAngle/50);
        this.pata1.rotation.z = -rotationAngle;
        this.pata2.rotation.z = rotationAngle;
        this.pata3.rotation.z = rotationAngle;

        this.pata4.rotation.z = -rotationAngle - 135;
        this.pata5.rotation.z = rotationAngle - 135;
        this.pata6.rotation.z = rotationAngle - 135;
    }
    
    
} export { Hormiga };
