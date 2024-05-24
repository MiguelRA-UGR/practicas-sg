import * as THREE from 'three'
import { CSG } from '../../libs/CSG-v2.js'

class Corona extends THREE.Object3D {
    constructor () {
        super()
        var material = new THREE.MeshStandardMaterial({
            color: 0xF0de44,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        })
       
        var radio = 0.5
        var grueso = radio/10
        var alto = radio*1.5
        var base = new THREE.Mesh (new THREE.CylinderGeometry(radio, radio, alto, 15, 15), material)
        var agujero = new THREE.Mesh (new THREE.CylinderGeometry(radio-grueso, radio-grueso, alto*2, 15, 15), material)
        var posiciones = []
        var formaMesh = []
        var picos=8

        var csg = new CSG()
        csg.union ([base])
        csg.subtract([agujero])

        for (let i=0 ; i<360/picos; i++)
        {
            posiciones[i] =  new THREE.CylinderGeometry(radio, radio, alto/2)
            posiciones[i].scale(radio/8*picos,1,1)
            posiciones[i].rotateX(THREE.MathUtils.degToRad(90))
            posiciones[i].translate(0,radio,radio/1.5)
            posiciones[i].rotateY(THREE.MathUtils.degToRad(i*360/picos))
            formaMesh[i] = new THREE.Mesh (posiciones[i], material)
            csg.subtract([formaMesh[i]])
        }

        var resultadoMesh = csg.toMesh()
        resultadoMesh.translateY(alto/2)
        this.add(resultadoMesh)
    }

    update () {

    }
}

export { Corona }