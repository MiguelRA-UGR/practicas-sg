import * as THREE from "../libs/three.module.js";
import { CSG } from '../libs/CSG-v2.js';
import { Mesh } from "../../Juego/libs/three.module.js";

class Grua extends THREE.Object3D {
    constructor(tipo) {
        super();
        
        this.maxGrados = 90;
        this.gradosRotados = 0;
        this.velocidadRotacion = 0.01;
        this.direccionRotacion = 1;
        this.velocidadRotacionCilindro = 0.01;

        const material = new THREE.MeshNormalMaterial();
        
        this.baseGeom = new THREE.CylinderGeometry(1, 1, 0.2);
        this.baseGeom.translate(0, 0.1, 0);
        this.base = new THREE.Mesh(this.baseGeom, material);

        this.paloGeom = new THREE.CylinderGeometry(0.2, 0.2, 4);
        this.paloGeom.translate(0, 2.1, 0);
        this.palo = new THREE.Mesh(this.paloGeom, material);

        this.brazoGeom = new THREE.BoxGeometry(0.3, 0.2, 4);
        this.brazoGeom.translate(0, 0.1, 1.5);
        this.brazo = new THREE.Mesh(this.brazoGeom, material);

        this.brazo.position.set(0, 4.1, 0);

        this.plumaGeom = new THREE.BoxGeometry(0.5, 0.2, 0.5);
        this.pluma = new THREE.Mesh(this.plumaGeom, material);
        this.pluma.position.set(0, -0.1, 0.5);

        this.barraGeom = new THREE.CylinderGeometry(0.05, 0.05, 1);
        this.barraGeom.translate(0, -0.6, 0);
        this.barra = new THREE.Mesh(this.barraGeom, material);
        
        this.imanGeom = new THREE.CylinderGeometry(0.2, 0.3, 0.2);
        this.imanGeom.translate(0, -1, 0);
        this.iman = new THREE.Mesh(this.imanGeom, material);

        this.pluma.add(this.iman);

        this.pluma.add(this.barra);

        this.brazo.add(this.pluma);
        this.add(this.brazo);
        this.add(this.palo);
        this.add(this.base);

        this.plumaZ = 0;
        this.barraScaleMin = 0.5;
        this.barraScaleMax = 1.5;
        this.turno = true;
        this.scalea = 1;
    }

    update() {
        // Rotación continua en el eje y
        this.rotateY(0.01);

        // Escalado oscilatorio de la barra en el eje y
        if (this.turno) {
            if (this.scalea <= 2) {
                this.scalea += 0.01;
            } else {
                this.turno = false;
            }
        } else {
            if (this.scalea >= -1) {
                this.scalea -= 0.01;
            } else {
                this.turno = true;
            }
        }
        this.barra.scale.y += this.scalea;
        this.iman.position.y+=this.scalea*0.01;
    }
}

export { Grua };
