import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

class Minigun extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        
        this.createGUI(gui);
        this.crearMateriales();

        //Variables para animación
        this.velocidadInicial = 0.000;
        this.velocidadMaxima = 0.5;
        this.velocidad = this.velocidadInicial;

        this.principalGeom = new THREE.CylinderGeometry(1,1,3,20,20);
		this.principal = new THREE.Mesh(this.principalGeom, this.planchaMetal);

		this.platoGeom = new THREE.CylinderGeometry(0.85,0.85,0.1,20,20);
		this.plato1 = new THREE.Mesh(this.platoGeom, this.metalPlata);
		
		
		this.plato2 = this.plato1.clone();
		this.plato3 = this.plato1.clone();
		this.plato1.position.set(0,1.55,0);
		this.add(this.plato1);
		this.plato2.position.set(0,7.5,0);
		this.plato1.add(this.plato2);
		this.plato3.position.set(0,3.5,0);
		this.plato1.add(this.plato3);

		this.canionGeom = new THREE.CylinderGeometry(0.2,0.2,8.1,10,10);
		this.canionCentro = new THREE.Mesh(this.canionGeom, this.metalPlata);
		this.canion = new THREE.Mesh(this.canionGeom, this.metalPlata);
		this.canionHueco = this.canion.clone();
		this.canionHueco.scale.set(0.5,3,0.5);
		this.canionHueco.position.set(0,3,0);
		
		var canionCSG = new CSG();
		canionCSG.subtract([this.canion, this.canionHueco]);
		this.canion = canionCSG.toMesh();
		this.canionCentro.position.set(0,4,0);
		
		this.canion2 = this.canion.clone();
		this.canion3 = this.canion.clone();
		this.canion4 = this.canion.clone();
		this.canion5 = this.canion.clone();
		this.canion6 = this.canion.clone();
		
		this.canion.position.set(-0.5,4,0);
		this.canion2.position.set(0.5,4,0);
		this.canion3.position.set(0.25,4,0.43);
		this.canion4.position.set(-0.25,4,0.43);
		this.canion5.position.set(-0.25,4,-0.43);
		this.canion6.position.set(0.25,4,-0.43);

		this.plato1.add(this.canion);
		this.plato1.add(this.canion2);
		this.plato1.add(this.canion3);
		this.plato1.add(this.canion4);
		this.plato1.add(this.canion5);
		this.plato1.add(this.canion6);
		this.plato1.add(this.canionCentro);

		this.cargadorGeom = new THREE.BoxGeometry(2,2,2.5);
		this.cargador = new THREE.Mesh(this.cargadorGeom,this.planchaMetal);
		this.cargador.position.set(0.25,-0.25,1.5);
		this.cargadorHueco = new THREE.Mesh(this.cargadorGeom,this.metalCromo);
		this.cargadorHueco.position.set(-1.25,-0.25,3);
		this.cargadorHueco.rotateY(THREE.MathUtils.degToRad(45));

		var cargadorCSG = new CSG();
		cargadorCSG.subtract([this.cargador, this.cargadorHueco]);
		this.cargador = cargadorCSG.toMesh();

		this.rotateZ(THREE.MathUtils.degToRad(-90));
		this.add(this.principal);
		this.add(this.cargador);
    };

	crearMateriales(){
		var textureLoader = new THREE.TextureLoader();
        var texture1 = textureLoader.load('../imgs/metal.jpg');

        this.planchaMetal = new THREE.MeshPhongMaterial({
            map : texture1,
            color: 0x8a9597,
            specular: 0x222222,
            shininess: 100,
        });
		
		this.metalPlata = new THREE.MeshStandardMaterial({
			color: 0x808080,
			metalness: 0.5,
			roughness: 0.5  
		});

		this.metalCromo = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 1,
			roughness: 0.2
		});
	}

	createGUI(gui) {
        this.guiControls = new function () {
            this.rotandoPlato = false;
        }

        var folder = gui.addFolder('Disparo');
        folder.add(this.guiControls, 'rotandoPlato').name('Rotar Plato');
    }

    update() {
        if (this.guiControls.rotandoPlato) {
            if (this.velocidad < this.velocidadMaxima) {
                this.velocidad += 0.005;
            }
        } else {
            if (this.velocidad > 0) {
                this.velocidad -= 0.005;
            }
        }

        this.plato1.rotateY(this.velocidad);
    }
}

export { Minigun };
