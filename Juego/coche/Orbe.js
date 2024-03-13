import * as THREE from '../libs/three.module.js';
import { CSG } from '../libs/CSG-v2.js';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';

const TipoOrbe = {
    //Tipos Buenos
    CADENCIA: 'cadencia',
    DAÑO_AUMENTADO: 'dañoAumentado',
    TAMAÑO_AUMENTADO: 'tamañoAumentado',
    VELOCIDAD_AUMENTADA: 'velocidadAumentada'
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
        
        this.tipo = tipo;
        this.distanciaUp = 0.25;
        this.crearObjetos();

        this.floteDirection = 1;
        this.floteSpeed = 0.005;
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
                pathOBJ = '../models/cadencia';
                pathMTL = '../models/cadencia';
                factorEscala=0.5;
                break;
            case TipoOrbe.DAÑO_AUMENTADO:
                pathOBJ = '../models/skull/skull.obj';
                pathMTL = '../models/skull/skull.mtl';
                factorEscala=0.0035;
                break;
            case TipoOrbe.TAMAÑO_AUMENTADO:
                pathOBJ = '../models/rueda1/disk.obj';
                pathMTL = '../models/rueda1/disk.mtl';
                factorEscala=0.2;
                break;
            case TipoOrbe.VELOCIDAD_AUMENTADA:
                pathOBJ = '../models/cheetah/cheetah.obj';
                pathMTL = '../models/cheetah/cheetah.mtl';

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
        this.esferaGeom = new THREE.SphereGeometry(1,32,32);

        switch (this.tipo) {
            case TipoOrbe.CADENCIA:
                this.color = 0xff8000;
                break;
            case TipoOrbe.DAÑO_AUMENTADO:
                this.color = 0xf52a00;
                break;
            case TipoOrbe.TAMAÑO_AUMENTADO:
                this.color = 0x00be11;
                break;
            case TipoOrbe.VELOCIDAD_AUMENTADA:
                this.color = 0x6eabff;
                break;
        }

        this.esfera = new THREE.Mesh(this.esferaGeom, new THREE.MeshStandardMaterial({ color: this.color, transparent: true, opacity: 0.5 }));
        this.add(this.esfera);
    }
    
    update() {
        this.position.y += this.floteSpeed * this.floteDirection;

        if (Math.abs(this.position.y) >= this.distanciaUp || Math.abs(this.position.y) <= 0) {
            this.floteDirection *= -1;
        }
    }
} export { Orbe, TipoOrbe };
