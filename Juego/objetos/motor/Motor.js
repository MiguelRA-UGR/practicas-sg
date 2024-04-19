import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

class Motor extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        
        this.createGUI(gui);
        this.crearMateriales();
        this.cargarModelos();

        //Variables para animación
        this.velocidadInicial = 0.000;
        this.velocidadMaxima = 0.5;
        
        this.velocidad = this.velocidadInicial;
        this.velocidadPistones = this.velocidadInicial;

        this.amplitudVibracion = 0.05;
        this.turnoVibracion=true;
        this.motorEncendido = false;
        this.turnoImpar=true;

        this.cilindroGeom = new THREE.CylinderGeometry(0.25,0.25,1,20,20);
        this.piston1 = new THREE.Mesh(this.cilindroGeom,this.metalPlata);
        this.tubo = new THREE.Mesh(this.cilindroGeom,this.metalPlata);
        this.plato1 = new THREE.Mesh(this.cilindroGeom,this.metalPlata);

        this.toroGeom = new THREE.TorusGeometry(0.25,0.025,20,20);
        this.toro = new THREE.Mesh(this.toroGeom,this.metalPlata);
        this.toro.rotateX(THREE.MathUtils.degToRad(90));
        this.toro.position.set(0,0.43,0);

        this.esferaGeom = new THREE.SphereGeometry(0.05,20,20);
        this.esfera = new THREE.Mesh(this.esferaGeom,this.metalPlata);
        this.esfera.position.set(0,0.5,0);

        var pistonCSG = new CSG();
		pistonCSG.subtract([this.piston1, this.toro, this.esfera]);
		this.piston1 = pistonCSG.toMesh();
        
        this.piston2 = this.piston1.clone();
        this.piston3 = this.piston1.clone();
        this.piston4 = this.piston1.clone();
        this.piston5 = this.piston1.clone();
        this.piston6 = this.piston1.clone();
        this.piston1.rotateZ(THREE.MathUtils.degToRad(-45));
        this.piston1.position.set(0.75,1,-0.5);
        this.piston2.rotateZ(THREE.MathUtils.degToRad(-45));
        this.piston2.position.set(0.75,1,0.15);
        this.piston3.rotateZ(THREE.MathUtils.degToRad(-45));
        this.piston3.position.set(0.75,1,0.8);
        this.piston5.rotateZ(THREE.MathUtils.degToRad(45));
        this.piston5.position.set(-0.75,1,-0.15);
        this.piston4.rotateZ(THREE.MathUtils.degToRad(45));
        this.piston4.position.set(-0.75,1,-0.8);
        this.piston6.rotateZ(THREE.MathUtils.degToRad(45));
        this.piston6.position.set(-0.75,1,0.5);
        
        this.plato2 = this.plato1.clone();
        this.plato2.scale.set(1.7,0.2,1.7);
        this.plato2.position.set(0,0.1,0);
        this.esfera1=this.esfera.clone();
        this.esfera2=this.esfera.clone();
        this.esfera3=this.esfera.clone();
        this.esfera4=this.esfera.clone();
        this.esfera1.position.set(-0.3,0,0);
        this.esfera2.position.set(0.3,0,0);
        this.esfera3.position.set(0,0,-0.3);
        this.esfera4.position.set(0,0,0.3);

        this.plato1.scale.set(1.5,0.1,1.5);

        var platoCSG = new CSG();
		platoCSG.subtract([this.plato1, this.plato2]);
		this.plato1 = platoCSG.toMesh();
        platoCSG.union([this.plato1, this.esfera1, this.esfera2, this.esfera3, this.esfera4]);
        this.plato1 = platoCSG.toMesh();
        this.plato2 = this.plato1.clone();

        this.tubo.scale.set(0.7,3,0.7);
        this.tubo.rotateX(THREE.MathUtils.degToRad(90));
        this.plato1.rotateX(THREE.MathUtils.degToRad(90));
        this.plato2.rotateX(THREE.MathUtils.degToRad(-90));
        this.plato1.position.set(0,0,1.45);
        this.plato2.position.set(0,0,-1.45);

        var ejeCSG = new CSG();
		ejeCSG.union([this.tubo, this.plato1, this.plato2]);
		this.eje = ejeCSG.toMesh();

        this.eje.position.set(0,0.4,0);
        this.eje.scale.set(1,1,0.9);

        this.add(this.eje);
        this.add(this.piston1);
        this.add(this.piston2);
        this.add(this.piston3);
        this.add(this.piston4);
        this.add(this.piston5);
        this.add(this.piston6);

    };

	crearMateriales(){
		this.metalPlata = new THREE.MeshStandardMaterial({
            color: 0x8a9597 ,
            metalness: 0.5, 
            roughness: 0.2
        });
	}

	createGUI(gui) {
        this.guiControls = new function () {
            this.motorEncendido = false;
            }
        
        var folder = gui.addFolder('Motor');
    
        folder.add(this.guiControls, 'motorEncendido').name('Encender Motor').onChange(() => {
            this.motorEncendido = !this.motorEncendido;
          });
    }
    

    cargarModelos() {
        const self = this;
    
        const mtlLoader = new MTLLoader();
        const mtlPath = '../../models/motor/motor.mtl';
    
        mtlLoader.load(mtlPath, function(materials) {
            materials.preload();
    
            const objLoader = new OBJLoader();
    
            objLoader.setMaterials(materials);
    
            const objPath = '../../models/motor/motor.obj';
    
            objLoader.load(objPath, function(motor) {
                
                motor.scale.set(0.05,0.05,0.05);
                motor.rotateX(THREE.MathUtils.degToRad(-90));
                self.add(motor);
                

            });
        });
    }
    
	update() {

        if (this.motorEncendido) {
            this.velocidad += 0.001;
            if (this.velocidad > this.velocidadMaxima) {
                this.velocidad = this.velocidadMaxima;
            }
            this.eje.rotateZ(this.velocidad);
        }else{
            this.velocidad -= 0.001;
            if (this.velocidad < 0) {
                this.velocidad = 0;
            }
        }

        this.eje.rotateZ(this.velocidad);

        if (this.motorEncendido) {
            if (this.turnoVibracion) {
                this.position.x += this.amplitudVibracion;
                this.turnoVibracion = !this.turnoVibracion;
            } else {
                this.position.x -= this.amplitudVibracion;
                this.turnoVibracion = !this.turnoVibracion;
            }
        }

        if (this.motorEncendido) {
            this.velocidadPistones += 0.0001;
            if (this.velocidadPistones > this.velocidadMaximaPiston) {
                this.velocidadPistones = this.velocidadMaximaPiston;
            }
        } else {
            this.velocidadPistones -= 0.0001;
            if (this.velocidadPistones < 0) {
                this.velocidadPistones = 0;
            }
            this.position.x=0;
        }

            if (this.turnoImpar) {
                //Impares suben
                //1 y 3 -->  5<--
                //Pares bajan
                //4 y 6 -->  2<--
                this.piston1.position.y += this.velocidadPistones;
                this.piston3.position.y += this.velocidadPistones;
                this.piston5.position.y += this.velocidadPistones;
                this.piston1.position.x += this.velocidadPistones;
                this.piston3.position.x += this.velocidadPistones;
                this.piston5.position.x -= this.velocidadPistones;
                this.piston2.position.y -= this.velocidadPistones;
                this.piston4.position.y -= this.velocidadPistones;
                this.piston6.position.y -= this.velocidadPistones;
                this.piston2.position.x -= this.velocidadPistones;
                this.piston4.position.x += this.velocidadPistones;
                this.piston6.position.x += this.velocidadPistones;
            } else {
                //Impares bajan
                //1 y 3 <--  5-->
                //Pares suben
                //4 y 6 <--  2-->
                this.piston1.position.y -= this.velocidadPistones;
                this.piston3.position.y -= this.velocidadPistones;
                this.piston5.position.y -= this.velocidadPistones;
                this.piston1.position.x -= this.velocidadPistones;
                this.piston3.position.x -= this.velocidadPistones;
                this.piston5.position.x += this.velocidadPistones;
                this.piston2.position.y += this.velocidadPistones;
                this.piston4.position.y += this.velocidadPistones;
                this.piston6.position.y += this.velocidadPistones;
                this.piston2.position.x += this.velocidadPistones;
                this.piston4.position.x -= this.velocidadPistones;
                this.piston6.position.x -= this.velocidadPistones;
            }
            

            // Cambiar la dirección de movimiento cuando alcanza el límite
            if (this.piston1.position.x >= 1 || this.piston2.position.x >= 1) {
                this.turnoImpar = !this.turnoImpar;
            }
        

        

    }
    
} export { Motor };
