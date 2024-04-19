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
    TIEMPO_RALENTIZADO: 'tiempoRalentizado',
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
        
        this.haymodelo=true;
        this.tipo = tipo;
        this.distanciaUp = 0.25;
        this.crearObjetos();

        this.floteDirection = 1;
        this.floteSpeed = 0.005;
        if(this.haymodelo)
            this.cargarModelo();
    }
    
    cargarModelo() {
        let pathOBJ = '';
        let pathMTL = '';

        this.materialObjetos = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        });

        var factorEscala = 0.5;
        switch (this.tipo) {
            case TipoOrbe.CADENCIA:
                this.haymodelo=false;
                pathOBJ = '../../models/cadencia';
                pathMTL = '../../models/cadencia';
                factorEscala=0.5;
                break;
            case TipoOrbe.DAÑO_AUMENTADO:
                this.haymodelo=true;
                pathOBJ = '../../models/skull/skull.obj';
                pathMTL = '../../models/skull/skull.mtl';
                factorEscala=0.0035;
                break;
            case TipoOrbe.TAMAÑO_AUMENTADO:
                this.haymodelo=false;
                
                break;
            case TipoOrbe.VELOCIDAD_AUMENTADA:
                this.haymodelo=true;
                pathOBJ = '../../models/cheetah/cheetah.obj';
                pathMTL = '../../models/cheetah/cheetah.mtl';

                factorEscala=0.045;
                break;
            
        }

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

    crearObjetos() {
        var textureLoader = new THREE.TextureLoader();

        this.materialBotella = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });

        switch (this.tipo) {
            case TipoOrbe.CADENCIA:
                this.color = 0xff8000;

                this.bala = new Bala();
                this.bala.rotateX(THREE.MathUtils.degToRad(45));
                this.bala.rotateZ(THREE.MathUtils.degToRad(45));
                this.bala.scale.set(0.75,0.75,0.75);
                this.add(this.bala);
                break;
            case TipoOrbe.DAÑO_AUMENTADO:
                this.color = 0xf52a00;
                break;

            case TipoOrbe.TIEMPO_RALENTIZADO:
                this.metalOro = new THREE.MeshStandardMaterial({
                    color: 0xe8ca3f,
                    metalness: 0.5,
                    roughness: 0.5
                });

                var texture = textureLoader.load('../../imgs/arena.avif');

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

            break;

            case TipoOrbe.TAMAÑO_AUMENTADO:
                
                var texture = textureLoader.load('../../imgs/pocima.avif');

                this.materialPocima = new THREE.MeshStandardMaterial({
                    color: 0xff00ff,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide,
                    map : texture
                });

                var texture = textureLoader.load('../../imgs/corcho.jpg');

                this.materialCorcho = new THREE.MeshStandardMaterial({
                    color: 0xbd7d3d,
                    map : texture
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
                break;
            case TipoOrbe.VELOCIDAD_AUMENTADA:
                this.color = 0x6eabff;
                break;
            
            case TipoOrbe.REPARAR:

                this.llave = new Llave();
                this.llave.rotateZ(THREE.MathUtils.degToRad(-30))

                this.llave.scale.set(0.4,0.4,0.4);
                this.add(this.llave);

                this.color = 0x000000;
                break;
        }

        this.add(this.esfera);
    }
    
    update() {
        this.position.y += this.floteSpeed * this.floteDirection;

        if (Math.abs(this.position.y) >= this.distanciaUp || Math.abs(this.position.y) <= 0) {
            this.floteDirection *= -1;
        }
    }
} export { Orbe, TipoOrbe };