import * as THREE from '../../../lib/three.module.js'
import PARAM from '../param/map.child.param.js'
import PUBLIC_METHOD from '../../../method/method.js'
import COORDS from '../../../data/jp_points.js'

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
        const positionGroup = new THREE.Group()
        this.wrapper = new THREE.Group()
        const plane = this.createPlaneMesh()

        COORDS.coordinates.forEach((data, i) => {
            const {rx, ry} = data

            const x = rx * PARAM.width
            const y = ry * -PARAM.height

            const matrix = new THREE.Matrix4()
            
            // const noise = SIMPLEX.noise3D(x * 0.002, y * 0.002, i * 0.01)
            // const scale = PUBLIC_METHOD.normalize(noise, 0.1, 10, -1, 1)
            const noise = SIMPLEX.noise3D(x * 0.01, y * 0.01, i * 0.02)
            const color = Math.floor(PUBLIC_METHOD.normalize(noise, 0, 60, -1, 1))

            matrix.multiply(new THREE.Matrix4().makeTranslation(x, y, 0))
            // matrix.multiply(new THREE.Matrix4().makeScale(1, 1, scale))
            // matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, PARAM.size / 2))

            plane.setMatrixAt(i, matrix)
            plane.setColorAt(i, new THREE.Color(`hsl(186, 100%, ${color}%)`))

            // if(i === 80 || i === 503) plane.setColorAt(i, new THREE.Color(0xffffff))
            
            // edge
            // const planeEdge = this.createEdgeMesh(new THREE.BoxGeometry(PARAM.size, PARAM.size, PARAM.size))
            // planeEdge.applyMatrix4(matrix)

            // positionGroup.add(planeEdge)
        })

        positionGroup.position.set(PARAM.width / -2, PARAM.height / 2 + PARAM.y, 0)

        positionGroup.add(plane)
        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    // plane
    createPlaneMesh(){
        const geometry = this.createPlaneGeometry()
        const material = this.createPlaneMaterial()
        return new THREE.InstancedMesh(geometry, material, COORDS.coordinates.length)
    }
    createPlaneGeometry(){
        return  new THREE.BoxGeometry(PARAM.size, PARAM.size, PARAM.size)
    }
    createPlaneMaterial(){
        return new THREE.MeshBasicMaterial({
            // color: PARAM.color,
            transparent: true,
            opacity: 1.0,
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
            depthWrite: false,
            depthTest: false,
            opacity: 0.5
        })
    }


    // animate
}