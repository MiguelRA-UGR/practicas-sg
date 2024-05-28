import * as THREE from '../../libs/three.module.js';
import { CSG } from '../../libs/CSG-v2.js';
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';
import { Bala } from '../bala/Bala.js'
import { Llave } from '../llave/Llave.js'

const TipoOrbe = {
    //Tipos Buenos
    CADENCIA: 'cadencia',
    DAÑO_AUMENTADO: 'dañoAumentado',
    TAMAÑO_AUMENTADO: 'tamañoAumentado',
    VELOCIDAD_AUMENTADA: 'velocidadAumentada',
    TIEMPO_AMPLIADO: 'tiempoAmpliado',
    PUNTOS: 'puntos',
    REPARAR: 'reparar'
};

class Orbe extends THREE.Object3D {
    constructor(tipo) {
        super();
        if (tipo && !Object.values(TipoOrbe).includes(tipo)) {
            throw new Error('Tipo de orbe no válido');
        }
        
        // Si no se pasa un tipo de orbe se crea uno de manera aleatoria
        if (!tipo) {
            const tipos = Object.values(TipoOrbe);
            tipo = tipos[Math.floor(Math.random() * tipos.length)];
        }
        
        this.haymodelo=false;
        this.desplazamiento=0;
        this.tipo = tipo;
        this.distanciaUp = 0.25;
        this.positionYInicial = 0.75;
        
        this.crearObjetos();

        this.floteDirection = 1;
        this.floteSpeed = 0.0025;

        this.cargarModelo();

        this.createLight();

        this.translateY(this.positionYInicial);
        this.scale.set(1.25,1.25,1.25);
    }
    
    cargarModelo() {
        let pathOBJ = "";
        let pathMTL = "";

        this.materialObjetos = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        });

        var factorEscala = 0.5;
        switch (this.tipo) {
            case TipoOrbe.DAÑO_AUMENTADO:
                this.haymodelo=true;
                pathOBJ = '../models/skull/skull.obj';
                pathMTL = '../models/skull/skull.mtl';
                factorEscala=0.0035;
                break;
            case TipoOrbe.VELOCIDAD_AUMENTADA:
                this.haymodelo=true;
                pathOBJ = '../models/cheetah/cheetah.obj';
                pathMTL = '../models/cheetah/cheetah.mtl';
                factorEscala=0.045;
                break;
        }

        if(this.haymodelo){
            const mtlLoader = new MTLLoader();
            mtlLoader.load(pathMTL, (materials) => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(pathOBJ, (object) => {

                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.material = this.materialObjetos;
                        }
                    });

                    object.scale.set(factorEscala, factorEscala, factorEscala);
                    this.add(object);
                });
            });
        }
    }

    crearObjetos() {
        var textureLoader = new THREE.TextureLoader();

        this.materialBotella = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });

        switch (this.tipo) {
            case TipoOrbe.CADENCIA:
                this.color = 0x00008b;

                this.bala = new Bala();
                this.bala.rotateX(THREE.MathUtils.degToRad(45));
                this.bala.rotateZ(THREE.MathUtils.degToRad(45));
                this.bala.scale.set(0.75,0.75,0.75);
                
                this.add(this.bala);
                break;
            case TipoOrbe.DAÑO_AUMENTADO:
                this.color = 0xf52a00;
                
                this.rotateY(THREE.MathUtils.degToRad(90));
                break;

            case TipoOrbe.TIEMPO_AMPLIADO:
                this.color = 0x3a9d23;
                this.metalOro = new THREE.MeshStandardMaterial({
                    color: 0xe8ca3f,
                    metalness: 0.5,
                    roughness: 0.5
                });

                var texture = textureLoader.load('../imgs/arena.avif');

                this.materialArena = new THREE.MeshStandardMaterial({
                    color: 0xf5deb3,
                    map : texture
                });

                this.relojShape = new THREE.Shape();
                this.relojShape.moveTo(0.0, 0.0);
                this.relojShape.lineTo(-0.4, 0.0);
                this.relojShape.quadraticCurveTo(-0.3, 0.4, -0.1, 0.6);
                this.relojShape.lineTo(-0.1, 0.7);
                this.relojShape.quadraticCurveTo(-0.3, 0.8, -0.4, 1.3);
                this.relojShape.lineTo(0.0, 1.3);
                var points = this.relojShape.getPoints();
                var relojGeom = new THREE.LatheGeometry(points, 100);
                var reloj = new THREE.Mesh(relojGeom, this.materialBotella);

                this.tapaGeom = new THREE.CylinderGeometry(0.5,0.5,0.15,20,20);
                var tapaArriba = new THREE.Mesh(this.tapaGeom,this.metalOro);
                var tabaAbajo = tapaArriba.clone();
                tapaArriba.position.set(0,1.3,0);

                this.barroteGeom = new THREE.CylinderGeometry(0.05,0.05,1.3,20,20);
                var barrote = new THREE.Mesh(this.barroteGeom,this.metalOro);
                var barrote1 = barrote.clone();
                var barrote2 = barrote.clone();
                var barrote3 = barrote.clone();
                barrote.position.set(-0.3,0.7,-0.3);
                barrote1.position.set(0.3,0.7,0.3);
                barrote2.position.set(-0.3,0.7,0.3);
                barrote3.position.set(0.3,0.7,-0.3);

                this.arenaGeom = new THREE.CylinderGeometry(0.15,0.35,0.5,20,20);
                var arena = new THREE.Mesh(this.arenaGeom,this.materialArena);
                arena.position.set(0.0,0.2,0.0);

                this.add(arena);
                this.add(barrote);
                this.add(barrote1);
                this.add(barrote2);
                this.add(barrote3);
                this.add(tapaArriba);
                this.add(tabaAbajo);

                this.add(reloj);

                this.translateY(-0.5);
            break;

            case TipoOrbe.TAMAÑO_AUMENTADO:
                this.color = 0xa212a2;
                
                var texture = textureLoader.load('../imgs/pocima.avif');
                var texture1 = textureLoader.load('../imgs/liquid.jpg');

                this.materialPocima = new THREE.MeshStandardMaterial({
                    color: 0xff00ff,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide,
                    map : texture,
                    normalMap: texture1,
                    normalScale: new THREE.Vector2(1, 1),

                });

                var texture = textureLoader.load('../imgs/corcho.jpg');
                var texture1 = textureLoader.load('../imgs/poros.jpg');

                this.materialCorcho = new THREE.MeshStandardMaterial({
                    color: 0xbd7d3d,
                    map : texture,
                    normalMap: texture1,
                    normalScale: new THREE.Vector2(1, 1),
                });
                
                this.botellaShape = new THREE.Shape();
                this.botellaShape.moveTo(0.0, 0.0);
                this.botellaShape.lineTo(-0.5, 0.0);
                this.botellaShape.lineTo(-0.5, 0.6);
                this.botellaShape.quadraticCurveTo(-0.4, 0.8, -0.2, 0.9);
                this.botellaShape.lineTo(-0.2, 1.4);
                this.botellaShape.quadraticCurveTo(-0.3, 1.45, -0.2, 1.5);
                this.botellaShape.lineTo(0.0, 1.5);
                var points = this.botellaShape.getPoints();
                var bottleGeom = new THREE.LatheGeometry(points, 100);
                var bottle = new THREE.Mesh(bottleGeom, this.materialBotella);

                this.contenidoGeom = new THREE.CylinderGeometry(0.4,0.4,0.5,20,20);
                var contenidoBotella = new THREE.Mesh(this.contenidoGeom,this.materialPocima);
                contenidoBotella.position.set(0,0.3,0);
                this.add(contenidoBotella);

                this.corchoGeom = new THREE.CylinderGeometry(0.2,0.15,0.3,20,20);
                var corcho = new THREE.Mesh(this.corchoGeom,this.materialCorcho);
                corcho.position.set(0,1.5,0);
                this.add(corcho);

                this.add(bottle);

                this.translateY(-0.5);
                break;
            case TipoOrbe.VELOCIDAD_AUMENTADA:
                this.color = 0x81d8d0;

                this.rotateY(THREE.MathUtils.degToRad(90));
                this.translateY(-0.3);
                break;
            
            case TipoOrbe.REPARAR:
                this.color = 0xff9300;

                this.llave = new Llave();
                this.llave.rotateZ(THREE.MathUtils.degToRad(-30))

                this.llave.scale.set(0.4,0.4,0.4);
                this.add(this.llave);

                break;

            case TipoOrbe.PUNTOS:
                this.color = 0xffff00;

                var texture = textureLoader.load('../imgs/normal.png');

                var materialMoneda = new THREE.MeshStandardMaterial({
                    normalMap: texture,
                    normalScale: new THREE.Vector2(1, 1),
                    color: 0xe8ca3f,
                    metalness: 0.5,
                    roughness: 0.5
                  });

                this.monedaGeom = new  THREE.CylinderGeometry(0.5,0.5,0.1,30,30);
                this.moneda = new THREE.Mesh(this.monedaGeom,materialMoneda); 
                
                const shape = new THREE.Shape();
                shape.moveTo(0, 0);
                shape.lineTo(1, 0);
                shape.lineTo(1, 1);
                shape.lineTo(0, 1);
                shape.lineTo(0, 0);

                var shapeGeom = new THREE.ShapeGeometry(shape);
                texture = textureLoader.load('../imgs/x2.png');
                var materialX2 = new THREE.MeshBasicMaterial({ map: texture, alphaTest:0.5 });
                this.porDos = new THREE.Mesh(shapeGeom, materialX2);
                
                this.porDos.position.set(-0.2,-0.7,0.1);
                this.porDos2 = this.porDos.clone()
                this.porDos2.position.set(0.2,-0.7,-0.1);
                this.porDos2.rotateY(THREE.MathUtils.degToRad(180));
            
                this.add(this.porDos);
                this.add(this.porDos2);

                this.moneda.rotateZ(THREE.MathUtils.degToRad(90));
                this.moneda.rotateX(THREE.MathUtils.degToRad(90));

                this.add(this.moneda);

                break;
        }

        this.add(this.esfera);
    }

    getTipo(){
        return this.tipo;
    }

    createLight() {
        this.light = new THREE.PointLight(this.color, 8,2);
        this.light.position.set(0, 0, 0);
        this.add(this.light);
    }
    
    update() {
        this.position.y += this.floteSpeed*this.floteDirection;

        if (this.desplazamiento >= this.distanciaUp) {
            this.floteDirection *= -1;
            this.desplazamiento=0;
        }

        this.desplazamiento+=this.floteSpeed;
        this.rotateY(0.01);
    }
} export { Orbe, TipoOrbe };