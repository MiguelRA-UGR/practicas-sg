import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import { Corona } from '../corona/Corona.js'

const TipoEscorvispa = {
    ESBIRRO: 'esbirro',
    SOLDADO: 'soldado',
    REINA: 'reina',
};

class Escorvispa extends THREE.Object3D {
    constructor(tipo) {
        super();

        const tipos = Object.values(TipoEscorvispa);

        if (!tipo || !tipos.includes(tipo)) {
            
            tipo = TipoEscorvispa.ESBIRRO;
        }

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

        this.cuerpoGeom.scale(1, 1.25,1 );
        this.cuerpoGeom.rotateX(THREE.MathUtils.degToRad(90))
        this.cuerpo = new THREE.Mesh(this.cuerpoGeom, this.materialPelo);
        this.cuerpo.castShadow = true
        this.cuerpo.receiveShadow = true
        this.cuerpo.userData=this;

		this.createAlas();
        this.createPatas();
		this.createCabeza();
		this.createCola();

        //this.cuerpo.visible=false;

        this.createPinzas();

        this.vida = 2;
        this.puntuacion = 10;

        if (this.tipo == TipoEscorvispa.REINA){
            this.añadirCorona();
            this.aguijon.scale.set(1.5,1.5,1.5);
            this.scale.set(2,2,2);
            this.vida = 8
            this.puntuacion = 100;
        }
        else if (this.tipo == TipoEscorvispa.SOLDADO){
            this.scale.set(1.5,1.5,1.5);
            this.puntuacion = 50;
            this.vida = 4;
        }
        
        this.scale.set(1.5,1.5,1.5);
        this.add(this.cuerpo);
    };

    añadirCorona(){
        this.corona = new Corona();

        this.cabeza.scale.set(0.7,0.7,0.7);

        this.corona.scale.set(0.45,0.45,0.45);
        this.corona.rotateX(THREE.MathUtils.degToRad(-65));
        this.corona.position.set(0,0.1,-0.45);

        this.cabeza.add(this.corona);
    }

	crearMateriales(){
		var textureLoader = new THREE.TextureLoader();
        var texture1 = textureLoader.load('../imgs/rayas.avif');
        var texture2 = textureLoader.load('../imgs/pelo.jpg');

        switch (this.tipo){
            case TipoEscorvispa.ESBIRRO:
                this.colorPrincipal = 0xffe400;
                break;
            case TipoEscorvispa.SOLDADO:
                this.colorPrincipal = 0x63340b; 
                break;
            case TipoEscorvispa.REINA:
                this.colorPrincipal = 0x800080;
                break;

        }

        this.materialPrincipal = new THREE.MeshPhongMaterial({
            color: this.colorPrincipal,
            specular: 0x222222,
            shininess: 100,
        });

        this.materialPelo = new THREE.MeshPhongMaterial({
            map : texture1,
            color: this.colorPrincipal,
            specular: 0x222222,
            shininess: 100,
        });

		this.materialNegro = new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0x222222,
            shininess: 100,
        });

        var normal = textureLoader.load("../imgs/wingNormal.png", function(normal) {
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            
            normal.repeat.set(0.5, 1);
          });

		this.materialAla = new THREE.MeshPhongMaterial({ 
            color: 0x80DAEB, 
            transparent: true, 
            opacity: 0.5, 
            side: THREE.DoubleSide,
            normalMap: normal,
            normalScale: new THREE.Vector2(1, 1), 
        });

		var texture = textureLoader.load('../imgs/ojo2.avif');
		this.materialOjo = new THREE.MeshBasicMaterial({ map: texture });

    this.materialPick = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
	}

    createCola() {
        this.cola = new THREE.Mesh(this.cuerpoGeom, this.materialPelo);
        this.cola.userData=this;
        this.cola.castShadow = true
        this.cola.receiveShadow = true
        this.cola.scale.set(0.75, 0.75, 0.75);
        this.cola.position.set(0, 0, -0.4);
        this.cola.rotateX(THREE.MathUtils.degToRad(-20));
    
        this.cola2 = this.cola.clone();
        this.cola2.userData=this;
        this.cola2.castShadow = true
        this.cola2.receiveShadow = true
        this.cola2.position.set(0, 0, -0.4);
        this.cola2.rotateX(THREE.MathUtils.degToRad(-20));
        
        this.cola3 = this.cola2.clone();
        this.cola3.userData=this;
        this.cola3.castShadow = true
        this.cola3.receiveShadow = true
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
        this.aguijon = new THREE.Mesh(aquijonGeom, this.materialNegro);
        this.aguijon.userData=this;
        this.aguijon.castShadow = true
        this.aguijon.receiveShadow = true

        this.aguijon.rotateX(THREE.MathUtils.degToRad(-90));
        this.aguijon.position.set(0,0,-0.);

    
        this.cola3.add(this.aguijon);

        this.cuerpo.add(this.cola);
    }
    
    createPinzas() {
        // Primer brazo
        this.brazo = new THREE.Mesh(this.cuerpoGeom, this.materialPelo);
        this.brazo.userData=this;
        this.brazo.castShadow = true
        this.brazo.receiveShadow = true
        this.brazo.rotateY(THREE.MathUtils.degToRad(50));
        this.brazo.position.set(0.25,0,0.20);
        this.brazo.scale.set(0.5,0.5,0.5);

        this.parte1 = this.brazo.clone();
        this.parte1.userData=this;
        this.parte1.castShadow = true
        this.parte1.receiveShadow = true
        this.parte1.scale.set(1.2,1.2,1.2);
        this.parte1.rotateY(THREE.MathUtils.degToRad(-40));
        this.parte1.rotateX(THREE.MathUtils.degToRad(40));
        this.parte1.position.set(0.2,-0.2,0.4);
        this.brazo.add(this.parte1);
    
        this.pinza = new THREE.Mesh(this.cuerpoGeom, this.materialNegro);
        this.pinza.userData=this;
        this.pinza.castShadow = true
        this.pinza.receiveShadow = true
        this.pinza.position.set(-0.2,0,0.4);
        this.pinza.scale.set(1.2,1.2,1.2);
        this.pinza.rotateY(THREE.MathUtils.degToRad(-60));
        
        this.partir = new THREE.Mesh(this.cuerpoGeom, this.materialPrincipal);
        this.partir.userData=this;
        this.partir.castShadow = true
        this.partir.receiveShadow = true
        this.partir.position.set(0,0,0.3);
        this.partir.scale.set(0.75,0.75,0.75);
    
        var tajogeom = new THREE.BoxGeometry(1,3.3,1);
        var tajo = new THREE.Mesh(tajogeom);
        tajo.position.set(0.5,-0.5,0.5);
    
        var pinza1CSG = new CSG();
        pinza1CSG.subtract([this.partir, tajo]);
        this.pinza1 = pinza1CSG.toMesh();
        this.pinza1.userData=this;
        this.pinza1.castShadow = true
        this.pinza1.receiveShadow = true
    
        this.pinza1.position.set(-0.1,0,0);
        this.pinza2 = this.pinza1.clone();
        this.pinza2.userData=this;
        this.pinza2.castShadow = true
        this.pinza2.receiveShadow = true
        this.pinza2.rotateZ(THREE.MathUtils.degToRad(180));
        this.pinza2.position.set(0.1,0,0);
        this.pinza.add(this.pinza2);
        
        this.parte1.add(this.pinza);
        this.pinza.add(this.pinza1);

        if(this.tipo != TipoEscorvispa.ESBIRRO)this.añadirPinchos();
        
        // Segundo brazo
        this.brazo2 = this.brazo.clone();
        this.brazo2.userData=this;
        this.brazo2.castShadow = true
        this.brazo2.receiveShadow = true
        this.brazo2.scale.z *= -1;
        this.brazo2.position.set(-0.25, 0, 0.20);
        this.brazo2.rotateY(THREE.MathUtils.degToRad(90));
        this.cuerpo.add(this.brazo2);
        this.cuerpo.add(this.brazo);
    }
    
    añadirPinchos(){
        //Pinchos
        this.pinchogeom = new THREE.ConeGeometry(0.1,0.3,20,20);
        this.pincho1 = new THREE.Mesh(this.pinchogeom, this.materialPelo);
        this.pincho1.castShadow = true
        this.pincho1.receiveShadow = true
        this.pincho2 = this.pincho1.clone();
        this.pincho2.castShadow = true
        this.pincho2.receiveShadow = true
        this.pincho3 = this.pincho1.clone();
        this.pincho3.castShadow = true
        this.pincho3.receiveShadow = true
        this.pincho4 = this.pincho1.clone();
        this.pincho4.castShadow = true
        this.pincho4.receiveShadow = true
        
        this.pincho1.position.set(0.1,0.2,0.05);
        this.pincho1.rotateZ(THREE.MathUtils.degToRad(-10));
        this.pincho2.position.set(-0.1,0.2,0.05);
        this.pincho2.rotateZ(THREE.MathUtils.degToRad(10));
        this.pincho3.position.set(0.1,0.2,-0.1);
        this.pincho3.rotateZ(THREE.MathUtils.degToRad(-10));
        this.pincho4.position.set(-0.1,0.2,-0.1);
        this.pincho4.rotateZ(THREE.MathUtils.degToRad(10));

        this.pinza.add(this.pincho1);
        this.pinza.add(this.pincho2);
        this.pinza.add(this.pincho3);
        this.pinza.add(this.pincho4);
        
       
   }

	createCabeza() {
        this.cabeza = new THREE.Mesh(this.cuerpoGeom, this.materialPrincipal);
        this.cabeza.userData=this;
        this.cabeza.castShadow = true
        this.cabeza.receiveShadow = true
		this.cabeza2 = this.cabeza.clone();
        this.cabeza2.userData=this;
        this.cabeza2.castShadow = true
        this.cabeza2.receiveShadow = true
		this.cabeza.scale.set(0.5,0.5,0.5);
		this.cabeza.position.set(0,0,0.4);
		this.cabeza.rotateX(THREE.MathUtils.degToRad(45));
		
		this.cabeza2.rotateY(THREE.MathUtils.degToRad(90));
		this.cabeza2.scale.set(1.3,1.3,1.3);
		this.cabeza2.position.set(0,0,-0.2);
		this.cabeza.add(this.cabeza2);

		this.ojo1 = new THREE.Mesh(this.cuerpoGeom, this.materialOjo);
        this.ojo1.userData=this;
        this.ojo1.castShadow = true
        this.ojo1.receiveShadow = true
		this.ojo1.scale.set(0.75,0.75,0.75);
		this.ojo2 = this.ojo1.clone();
        this.ojo2.userData=this;
        this.ojo2.castShadow = true
        this.ojo2.receiveShadow = true
		
		this.ojo1.position.set(-0.25,0.15,-0.1);
		this.ojo1.rotateY(THREE.MathUtils.degToRad(30));
		this.ojo1.rotateZ(THREE.MathUtils.degToRad(35));
		this.ojo2.position.set(0.25,0.15,-0.1);
		this.ojo2.rotateY(THREE.MathUtils.degToRad(-30));
		this.ojo2.rotateZ(THREE.MathUtils.degToRad(-35));

		this.tenazaGeom = new THREE.TorusGeometry(0.25, 0.05, 20, 20);
		this.tenaza = new THREE.Mesh(this.tenazaGeom, this.materialNegro);
        this.tenaza.userData=this;
        this.tenaza.castShadow = true
        this.tenaza.receiveShadow = true
		this.tenaza.scale.set(0.7,1,0.7);
		this.tenaza.rotateX(THREE.MathUtils.degToRad(90));
		this.tenaza.position.set(0,0,0.1);
		
		var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
		var boxMesh = new THREE.Mesh(boxGeometry);
		boxMesh.position.set(0.5, 0, 0.5);
		var csg = new CSG();
		csg.subtract([this.tenaza, boxMesh]);
		this.tenaza1 = csg.toMesh();
        this.tenaza1.userData=this;
        this.tenaza1.castShadow = true
        this.tenaza1.receiveShadow = true

		this.tenaza2 = this.tenaza1.clone();
        this.tenaza2.userData=this;
        this.tenaza2.castShadow = true
        this.tenaza2.receiveShadow = true
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
        this.antena1.castShadow = true
        this.antena1.receiveShadow = true
        this.antena2 = this.antena1.clone();
        this.antena2.position.set(-0.2,0.2,-0.3);
        this.antena2.rotateY(THREE.MathUtils.degToRad(180))
        this.antena2.castShadow = true
        this.antena2.receiveShadow = true

        this.cabeza.add(this.antena1);
        this.cabeza.add(this.antena2);
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
        
        this.ala1 = new THREE.Mesh(winggeometry, this.materialAla);
        this.ala1.userData=this;
        this.ala1.castShadow = true
        this.ala1.receiveShadow = true
        this.ala1.rotateX(THREE.MathUtils.degToRad(90));
        this.ala1.position.set(0, 0.15, 0.20);

        this.ala2 = this.ala1.clone();
        this.ala2.userData=this;
        this.ala2.castShadow = true
        this.ala2.receiveShadow = true
        this.ala2.rotateY(THREE.MathUtils.degToRad(180));
        this.ala2.position.set(0, 0.15, 0.20);

        this.ala3 = this.ala1.clone();
        this.ala3.userData=this;
        this.ala3.castShadow = true
        this.ala3.receiveShadow = true
        this.ala3.scale.set(0.8, 0.8, 0.8);
        this.ala3.rotateZ(THREE.MathUtils.degToRad(13))
        this.ala3.position.set(0, 0.15, 0);

        this.ala4 = this.ala3.clone();
        this.ala4.userData=this;
        this.ala4.castShadow = true
        this.ala4.receiveShadow = true
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
        this.pata1 = new THREE.Mesh(leggeometry, this.materialNegro);
        this.pata1.userData=this;
        this.pata1.castShadow = true
        this.pata1.receiveShadow = true


        this.pata2 = this.pata1.clone();
        this.pata2.userData=this;
        this.pata2.castShadow = true
        this.pata2.receiveShadow = true
        this.pata3 = this.pata1.clone();
        this.pata3.userData=this;
        this.pata3.castShadow = true
        this.pata3.receiveShadow = true
        this.pata4 = this.pata1.clone();
        this.pata4.userData=this;
        this.pata4.castShadow = true
        this.pata4.receiveShadow = true
        this.pata5 = this.pata1.clone();
        this.pata5.userData=this;
        this.pata5.castShadow = true
        this.pata5.receiveShadow = true
        this.pata6 = this.pata1.clone();
        this.pata6.userData=this;
        this.pata6.castShadow = true
        this.pata6.receiveShadow = true

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

	update() {
        // //Animacion Alas
        if(this.batirarriba) {
            this.valorbatida += this.velocidadbatida;
        } else {
            this.valorbatida -= this.velocidadbatida;
        }
        
        this.ala1.rotateY(this.valorbatida);
        this.ala2.rotateY(-this.valorbatida);
        this.ala3.rotateY(this.valorbatida);
        this.ala4.rotateY(-this.valorbatida);
    
        if(Math.abs(this.valorbatida) >= this.margenbatida) {
            this.batirarriba = !this.batirarriba;
        }

        //Animacion cola y pinzas
        if(this.movimiento) {
            this.valormovimiento += this.velocidadmovimienton;
        } else {
            this.valormovimiento -= this.velocidadmovimienton;
        }
        
        this.cola.rotateX(this.valormovimiento);
        this.cola2.rotateX(this.valormovimiento);
        this.cola3.rotateX(this.valormovimiento);
        this.cabeza.rotateX(-this.valormovimiento);

        this.brazo2.rotateX(this.valormovimiento);
        this.brazo.rotateX(-this.valormovimiento);
        this.parte1.rotateX(this.valormovimiento);
        this.tenaza1.rotateY(this.valormovimiento);
        this.tenaza2.rotateY(this.valormovimiento);

        this.pata1.rotateZ(this.valormovimiento*0.5);
        this.pata2.rotateZ(this.valormovimiento*0.5);
        this.pata3.rotateZ(this.valormovimiento*0.5);
        this.pata4.rotateZ(this.valormovimiento*0.5);
        this.pata5.rotateZ(this.valormovimiento*0.5);
        this.pata6.rotateZ(this.valormovimiento*0.5);
    
        if(Math.abs(this.valormovimiento) >= this.margenmovimiento) {
            this.movimiento = !this.movimiento;
        } 

    }

    pick(danio) {
      this.traverse((child) => {
          if (child.material) {
              child.originalMaterial = child.material
              child.material = this.materialPick
          }
      });

      setTimeout(() => {
          this.restoreOriginalMaterials()
      }, 250)

      this.vida -= danio
  }

  restoreOriginalMaterials() {
      this.traverse((child) => {
          if (child.originalMaterial) {
              child.material = child.originalMaterial
              delete child.originalMaterial
          }
      });
  }
    
} export { Escorvispa,TipoEscorvispa };
