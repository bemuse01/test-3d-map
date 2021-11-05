import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'
import PARAM from '../param/map.child.param.js'
import COORDS from '../../../data/data.js'

export default class{
    constructor({group}){
        this.init(group)
    }


    // init
    init(group){
        this.create(group)
    }


    // create
    create(group){
        this.mesh = this.createPlaneMesh()

        COORDS.coordinates.forEach((data, i) => {
            const {lat, lng} = data
            // const {x, y, z} = PUBLIC_METHOD.getSphereCoord(lat, lng, 750)
            const {x, y} = PUBLIC_METHOD.getFlatCoord(lat, lng, PARAM.width, PARAM.height)
            const matrix = new THREE.Matrix4()
            console.log(x, y)
            
            const scale = 0.5 + Math.random() * 2.5

            // matrix.makeScale(1, 1, scale)
            matrix.makeTranslation(x, y, 0)

            this.mesh.setMatrixAt(i, matrix)
        })

        this.mesh.position.set(-PARAM.width, PARAM.height / -2, 0)

        group.add(this.mesh)
    }
    createPlaneMesh(){
        const geometry = this.createPlaneGeometry()
        const material = this.createPlaneMaterial()
        return new THREE.InstancedMesh(geometry, material, COORDS.coordinates.length)
    }
    createPlaneGeometry(){
        return new THREE.PlaneGeometry(PARAM.size, PARAM.size)
    }
    createPlaneMaterial(){
        return new THREE.MeshBasicMaterial({
            color: PARAM.color,
            transparent: true,
            side: THREE.DoubleSide
        })
    }


    // animate
    animate(){
        // this.mesh.rotation.y += 0.005
    }
}