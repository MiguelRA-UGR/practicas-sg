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

        var base = new THREE.Mesh (new THREE.CylinderGeometry(0.8, 1, 0.2), this.material_verde)

        var segmentos = []
        var segmentosMesh = []
        var resolucion = 500
        var radio = 1
        var ancho = 2*Math.PI*radio/resolucion
        var grosor = 0.2
        const altura = 0.6
        var alpha, largo
        var incremento=2*Math.PI/resolucion
        var x = 0.05

        var alto = altura*2
        var grueso = grosor/4

        var base = new THREE.Mesh (new THREE.CylinderGeometry(radio, radio, alto), material)
        var agujero = new THREE.Mesh (new THREE.CylinderGeometry(radio-grueso, radio-grueso, alto*2), material)

        var csg = new CSG()
        csg.union ([base])
        csg.subtract([agujero])

        for (let i=0; i<resolucion; i++) {
            alpha = i*incremento
            //largo = altura+0.2*altura*Math.sin(8*alpha)
            largo = - altura * Math.abs(Math.sin(x))
            x += 0.05
            segmentos.push(new THREE.BoxGeometry(ancho, largo, grosor))
            segmentos[i].translate(0,largo/2+altura+0.01,radio)
            segmentos[i].rotateY(THREE.MathUtils.degToRad(i*(360/resolucion)))
            segmentosMesh[i] = new THREE.Mesh( segmentos[i], material )
            this.add(segmentosMesh[i])
        }

        //this.add(base)
        //this.add(agujero)

        var resultadoMesh = csg.toMesh()
        this.add(resultadoMesh)
    }

    createGUI (gui, titleGui) {

    }

    update () {

    }
}

export {Corona}