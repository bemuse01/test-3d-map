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
        const mesh = this.createPlaneMesh()

        COORDS.coordinates.forEach((data, i) => {
            const {lat, lng} = data
            const {x, y} = PUBLIC_METHOD.getFlatCoord(lat, lng, PARAM.width, PARAM.height)
            const matrix = new THREE.Matrix4()
            
            const scale = 0.5 + Math.random() * 2.5

            matrix.makeScale(1, 1, scale)
            matrix.makeTranslation(x, y, 0)

            mesh.setMatrixAt(i, matrix)
        })
    }
    createPlaneMesh(){
        const geometry = this.createPlaneGeometry()
        const material = this.createPlaneMaterial()
        return new THREE.InstancedMesh(geometry, material, COORDS.coordinates.length)
    }
    createPlaneGeometry(){
        return new THREE.PlaneGeometry(PARAM.width, PARAM.height)
    }
    createPlaneMaterial(){
        return new THREE.MeshBasicMaterial({
            color: PARAM.color,
            transparent: true
        })
    }
}