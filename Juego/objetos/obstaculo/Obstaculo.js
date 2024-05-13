import * as THREE from '../../libs/three.module.js';
import { CSG } from '../../libs/CSG-v2.js';
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';
import { Babosa } from '../babosa/Babosa.js'
import { Oruga } from '../oruga/Oruga.js'
//import { Araña } from '../llave/Llave.js'
//import { Cucaracha } from '../cucaracha/Cucaracha.js'

const TipoObstaculo = {
    BABOSA: 'babosa',
    ORUGA: 'oruga',
    //ARAÑA: 'araña',
    //CUCARACHA: 'cucaracha',
};

class Obstaculo extends THREE.Object3D {
    constructor(tipo) {
        super();
        if (tipo && !Object.values(TipoObstaculo).includes(tipo)) {
            throw new Error('Tipo de obstaculo no válido');
        }
        
        if (!tipo) {
            const tipos = Object.values(TipoObstaculo);
            tipo = tipos[Math.floor(Math.random() * tipos.length)];
        }
        switch (tipo) {
            case TipoObstaculo.BABOSA:
                this.modelo = new Babosa();
                this.scale.set(2,2,2);
                break;
            case TipoObstaculo.ORUGA:
                this.modelo = new Oruga()
                break;
        }
        this.modelo.rotateY(THREE.MathUtils.degToRad(-90));

        this.add(this.modelo);
    }

    getTipo(){
        return this.tipo;
    }

    update() {
        this.modelo.update();
    }
} export { Obstaculo, TipoObstaculo };