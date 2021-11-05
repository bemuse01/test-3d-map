import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'
import PARAM from '../param/map.child.param.js'
import COORDS from '../../../data/points.js'

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
        this.rotationGroup = new THREE.Group()
        const plane = this.createPlaneMesh()

        COORDS.coordinates.forEach((data, i) => {
            const {rx, ry} = data

            const x = rx * PARAM.width
            const y = ry * -PARAM.height

            const matrix = new THREE.Matrix4()
            
            const scale = 0.5 + Math.random() * 9.5

            matrix.multiply(new THREE.Matrix4().makeTranslation(x, y, 0))
            matrix.multiply(new THREE.Matrix4().makeScale(1, 1, scale))
            matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, PARAM.size / 2))

            plane.setMatrixAt(i, matrix)
        })

        plane.position.set(PARAM.width / -2, PARAM.height / 2, 0)

        // this.rotationGroup.position.z = -300
        this.rotationGroup.rotation.x = -60 * RADIAN
        
        this.rotationGroup.add(plane)
        group.add(this.rotationGroup)
    }
    // plane
    createPlaneMesh(){
        const geometry = this.createPlaneGeometry()
        const material = this.createPlaneMaterial()
        return new THREE.InstancedMesh(geometry, material, COORDS.coordinates.length)
    }
    createPlaneGeometry(){
        return new THREE.BoxGeometry(PARAM.size, PARAM.size, PARAM.size)
    }
    createPlaneMaterial(){
        return new THREE.MeshBasicMaterial({
            color: PARAM.color,
            transparent: true,
            opacity: 0.25,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })
    }
    // plane edge
    createEdgeMesh(geo){
        const geometry = this.createEdgeGeometry(geo)
        const material = this.createEdgeMaterial()
        return new THREE.LineSegments(geometry, material)
    }
    createEdgeGeometry(geo){
        return new THREE.EdgesGeometry(geo)
    }
    createEdgeMaterial(){
        return new THREE.LineBasicMaterial({
            color: PARAM.color,
            transparent: true,
            opacity: 0.5
        })
    }


    // animate
    animate(){
        this.rotationGroup.rotation.z += 0.002
    }
}