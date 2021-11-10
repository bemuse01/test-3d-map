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

        const r1 = ~~(Math.random() * COORDS.coordinates.length)
        const r2 = ~~(Math.random() * COORDS.coordinates.length)
        const p1 = COORDS.coordinates[r1]
        const p2 = COORDS.coordinates[r2]
        const pp1 = {x: p1.rx * CHILD_PARAM.width, y: p1.ry * -CHILD_PARAM.height}
        const pp2 = {x: p2.rx * CHILD_PARAM.width, y: p2.ry * -CHILD_PARAM.height}

        const {rx, ry} = METHOD.getCenterPoint(p1, p2)
        const cx = rx * CHILD_PARAM.width
        const cy = ry * -CHILD_PARAM.height
        const dist = Math.sqrt((pp1.x - pp2.x) ** 2 + (pp1.y - pp2.y) ** 2) / 2
        const deg = 180 / this.param.seg

        const pp3 = pp1.y > pp2.y ? pp1 : pp2
        const v1 = new THREE.Vector2(pp3.x - cx, pp3.y - cy)
        const v2 = new THREE.Vector2(pp3.x + cx, 0)
        const out = v1.x * v2.x + v1.y * v2.y
        const dot = Math.sqrt(v1.x ** 2 + v1.y ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2)
        const theta = Math.acos(out / dot)

        // console.log(theta)

        const mesh = this.createLineMesh({dist, deg})
        mesh.position.set(cx, cy, 0)
        mesh.rotation.x = 90 * RADIAN
        mesh.rotation.y = theta
        // mesh.position.y = CHILD_PARAM.y

        positionGroup.position.set(CHILD_PARAM.width / -2, CHILD_PARAM.height / 2 + CHILD_PARAM.y, 50)

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

        // geometry.setDrawRange(0, 0)

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


    // tween


    // animate
    animate(){

    }
}