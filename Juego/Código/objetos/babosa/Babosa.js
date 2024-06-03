import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

class Babosa extends THREE.Object3D {
    constructor() {
        super();
        
		this.crearMateriales();

		this.turnoanimacion=true;
		this.expansionMaxima=1.2;
		this.velExpansion=0.0025;
		this.expansion=1;

		const points = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(-0.1, 0.1, 0),
			new THREE.Vector3(-0.15, 0.5, 0),
			new THREE.Vector3(-0.3, 1, 0),
			new THREE.Vector3(-0.35, 1.5, 0),
			new THREE.Vector3(-0.4, 1.9, 0),
			new THREE.Vector3(-0.25, 2.3, 0),
			new THREE.Vector3(-0.15, 2.65, 0),
			new THREE.Vector3(0, 2.7, 0),

		];
		
		const curve = new THREE.CatmullRomCurve3(points);
		
		const divisions = 50;
		const pointsOnCurve = curve.getPoints(divisions);
		
		const cuerpoGeom = new THREE.LatheGeometry(pointsOnCurve, 20, 0, Math.PI * 2);
		
		this.cuerpo = new THREE.Mesh(cuerpoGeom, this.materialBabosa);

		this.huecoGeom = new THREE.BoxGeometry(2,6,0.55);
		this.hueco = new THREE.Mesh(this.huecoGeom, this.materialBabosa);
		this.hueco.position.set(0,0,0.3);

		var cuerpoCSG = new CSG();
		
		cuerpoCSG.subtract([this.cuerpo, this.hueco]);
		this.cuerpo = cuerpoCSG.toMesh();

		var path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.1, 0.35, 0.1),
            new THREE.Vector3(0.25, 0.4, 0.2),
        ]);

        var legShape = new THREE.Shape();
        legShape.moveTo(0.015, 0);
        legShape.lineTo(0.015, 0.025);
        legShape.lineTo(-0.015, 0.025);
        legShape.lineTo(-0.015, 0);
        legShape.lineTo(0.015, 0);

        var extrudeSettings = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: path
        };

        var antenageom = new THREE.ExtrudeGeometry(legShape, extrudeSettings);
        this.antena1 = new THREE.Mesh(antenageom, this.materialBabosa);
		this.add(this.antena1);
		this.antena1.position.set(0.05,0,1.3);

		var bolaAntenaGeom = new THREE.SphereGeometry(0.05,20,20);
		this.bola = new THREE.Mesh(bolaAntenaGeom,this.materialAntena);
		this.bola.position.set(0.25,0.4,0.2);
		this.antena1.add(this.bola);
		this.antena2 = this.antena1.clone();
		this.antena2.scale.x*=-1;
		this.antena2.position.set(-0.05,0,1.3);
		this.add(this.antena2);

		this.antena3 = this.antena1.clone();
		this.antena3.scale.set(0.75,0.6,0.75);
		this.antena3.position.set(0.045,0,1.35);
		this.antena3.rotateX(THREE.MathUtils.degToRad(20));
		this.add(this.antena3);

		this.antena4 = this.antena1.clone();
		this.antena4.scale.set(-0.75,0.6,0.75);
		this.antena4.position.set(-0.045,0,1.35);
		this.antena4.rotateX(THREE.MathUtils.degToRad(20));
		this.add(this.antena4);

		this.cuerpo.rotateX(THREE.MathUtils.degToRad(90));
		this.add(this.cuerpo);
		this.cuerpo.position.set(0,0,-1.25);

    };

	crearMateriales(){
		var textureLoader = new THREE.TextureLoader();
		var texture1 = textureLoader.load('../imgs/rugoso.jpg');

		this.materialBabosa = new THREE.MeshStandardMaterial({
			color: 0x91a14b,
			normalMap: texture1,
            normalScale: new THREE.Vector2(1, 1),
			side: THREE.DoubleSide,
			transparent: true, 
			opacity: 0.8
			    
		});

		this.materialAntena = new THREE.MeshStandardMaterial({
			color: 0x91a14b,
		});
	}


    update() {
		if(this.turnoanimacion){
			if(this.expansion>=this.expansionMaxima){
				this.expansion=this.expansionMaxima;
				this.turnoanimacion=false;
			}else{
				this.expansion+=this.velExpansion;
			}


		}else{
			if(this.expansion<= 1){
				this.expansion= 1;
				this.turnoanimacion=true;
			}else{
				this.expansion-=this.velExpansion;
			}
		}

		this.scale.set(this.expansion,this.expansion,1);


    }
}

export { Babosa };
