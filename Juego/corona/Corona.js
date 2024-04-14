import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import { CylinderGeometry } from '../libs/three.module.js';

class Corona extends THREE.Object3D {
    constructor (gui, titleGui) {
        super()
        this.createGUI(gui, titleGui)
        var material = new THREE.MeshStandardMaterial({
            color: 0xF0de44,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        })
        /*
        var circulo = new THREE.Shape()
        var radio = 0.1
        var alpha
        var resolucion = 30
        var incremento=2*Math.PI/resolucion

        circulo.moveTo(radio, 0)
        for (let i=0; i<resolucion; i++) {
            alpha = i*incremento
            circulo.lineTo(radio*Math.cos(alpha), radio*Math.sin(alpha))
        }
        */
        /*
        var segmento = new THREE.Shape()
        var ancho = 0.01
        var largo = 0.2
        segmento.moveTo(-ancho/2,-largo/2)
        segmento.lineTo(ancho/2, -largo/2)
        segmento.lineTo(ancho/2, largo/2)
        segmento.lineTo(-ancho/2, largo/2)

        const puntospicos = []
        var radiocabeza = 1
        const alturapico = 0.5
        var alpha, altura
        var resolucion = 100
        var incremento=2*Math.PI/resolucion
        for (let i=0; i<resolucion; i++) {
            alpha = i*incremento
            altura = radiocabeza*Math.sin(alpha*5)*alturapico
            puntospicos.push(new THREE.Vector3(radiocabeza*Math.cos(alpha), altura, radiocabeza*Math.sin(alpha)))
        }
        puntospicos.push(puntospicos[0])
        puntospicos.push(puntospicos[1])
        
        const barrido = new THREE.CatmullRomCurve3(puntospicos)

        const extrudepicosSettings = {
            steps: 100,
            curveSegments: 4,
            extrudePath: barrido,
        };

        const picosGeom = new THREE.ExtrudeGeometry(segmento, extrudepicosSettings)
        const picos = new THREE.Mesh( picosGeom, material ) 
        picos.rotation.x = Math.PI / 2

        this.add(picos)
        */

        var segmentos = []
        var segmentosMesh = []
        var resolucion = 500
        var radio = 1
        var ancho = 2*Math.PI*radio/resolucion
        var grosor = 0.01
        const altura = 0.75
        var alpha, largo
        var incremento=2*Math.PI/resolucion

        for (let i=0; i<resolucion; i++) {
            alpha = i*incremento
            largo = altura + 0.2 * altura * Math.sin(4 * alpha)
            segmentos.push(new THREE.BoxGeometry(ancho, largo, grosor))
            segmentos[i].translate(0,largo/2,radio)
            segmentos[i].rotateY(THREE.MathUtils.degToRad(i*(360/resolucion)))
            segmentosMesh[i] = new THREE.Mesh( segmentos[i], material )
            this.add(segmentosMesh[i])
        }
    }

    createGUI (gui, titleGui) {

    }

    update () {

    }
}

export {Corona}