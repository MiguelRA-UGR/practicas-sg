import * as THREE from 'three'
import { CSG } from '../../libs/CSG-v2.js'

class Llave extends THREE.Object3D {
    constructor () {
        super()
        var material = new THREE.MeshStandardMaterial({
            color: 0xC7C7C7,
            roughness: 0.2,
            metalness: 0.75,
            side: THREE.DoubleSide,
        })

        var factor = 1;

        var cabeza = new THREE.Shape()
        cabeza.moveTo(-factor/2,0)
        cabeza.quadraticCurveTo(-factor/2,factor/2,-factor/4,3*factor/4)
        cabeza.lineTo(-factor/4,3*factor/8)
        cabeza.quadraticCurveTo(-factor/4,factor/4,-factor/8,factor/4)
        cabeza.lineTo(factor/8,factor/4)
        cabeza.quadraticCurveTo(factor/4,factor/4,factor/4,3*factor/8)
        cabeza.lineTo(factor/4,3*factor/4)
        cabeza.quadraticCurveTo(factor/2,factor/2,factor/2,0)
        cabeza.quadraticCurveTo(factor/2,-4/5*factor/8,-factor/8,-factor/2)
        cabeza.lineTo(-factor/8-factor/4*Math.cos(THREE.MathUtils.degToRad(20)), -factor/2+factor/4*Math.sin(THREE.MathUtils.degToRad(20)))
        

        var extrudeSettings = {
            steps: factor*10,
            depth: factor/4,
            bevelEnabled: false
        }

        const cabezaGeom = new THREE.ExtrudeGeometry(cabeza, extrudeSettings)
        cabezaGeom.rotateZ(THREE.MathUtils.degToRad(20))
        const cabezaMesh = new THREE.Mesh( cabezaGeom, material )

        var palo = new THREE.BoxGeometry(factor/2, factor*2, factor/4)
        palo.translate(-factor/16,-factor-factor/4,factor/8)
        var paloMesh = new THREE.Mesh (palo, material)

        var cola = new THREE.CylinderGeometry(factor/4,factor/4,factor/4)
        cola.rotateX(THREE.MathUtils.degToRad(90))
        cola.translate(-factor/16,-factor*2-factor/4,factor/8)
        var colaMesh = new THREE.Mesh (cola, material)

        var agujero = new THREE.CylinderGeometry(factor/8,factor/8,factor/4)
        agujero.rotateX(THREE.MathUtils.degToRad(90))
        agujero.translate(-factor/16,-factor*2-factor/4,factor/8)
        var agujeroMesh = new THREE.Mesh (agujero, material)

        //this.add(cabezaMesh)
        //this.add(paloMesh)
        //this.add(colaMesh)

        var csg = new CSG()
        csg.union ([cabezaMesh, paloMesh, colaMesh])
        csg.subtract ([agujeroMesh])

        var resultadoMesh = csg.toMesh()
        resultadoMesh.position.set(factor/16,factor,0)
        this.add(resultadoMesh)

    }

    update () {

    }

}

export { Llave }