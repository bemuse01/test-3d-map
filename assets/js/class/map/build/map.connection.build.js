import * as THREE from '../../../lib/three.module.js'
import COORDS from '../../../data/jp_points.js'
import METHOD from '../method/map.connection.method.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            seg: 100
        }

        this.draw = 0

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

        const p1 = COORDS.coordinates[~~(Math.random() * COORDS.coordinates.length)]
        const p2 = COORDS.coordinates[~~(Math.random() * COORDS.coordinates.length)]

        const {rx, ry, rdist} = METHOD.getCenterPoint(p1, p2)
        const cx = rx * CHILD_PARAM.width
        const cy = ry * -CHILD_PARAM.height
        const dist = rdist * CHILD_PARAM.width
        const deg = 180 / this.param.seg

        const mesh = this.createLineMesh({dist, deg})
        mesh.position.set(cx, cy, 0)
        mesh.rotation.x = 90 * RADIAN
        // mesh.position.y = CHILD_PARAM.y

        positionGroup.position.set(CHILD_PARAM.width / -2, CHILD_PARAM.height / 2 + CHILD_PARAM.y, 0)

        positionGroup.add(mesh)
        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    // line
    createLineMesh({dist, deg}){
        const geometry = this.createLineGeometry({dist, deg})
        const material = this.createLineMaterial()
        return new THREE.Line(geometry, material)
    }
    createLineGeometry({dist, deg}){
        const position = new Float32Array(this.param.seg * 3)

        for(let i = 0; i < this.param.seg; i++){
            const x = Math.cos(i * deg * RADIAN) * dist
            const y = Math.sin(i * deg * RADIAN) * dist
            position[i * 3] = x
            position[i * 3 + 1] = y
            position[i * 3 + 2] = 0
        }

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createLineMaterial(){
        return new THREE.LineBasicMaterial({
            color: this.param.color,
            transparent: true,
            depthWrite: false,
            depthTest: false
        }) 
    }


    // animate
}