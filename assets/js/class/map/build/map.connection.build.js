import * as THREE from '../../../lib/three.module.js'
import COORDS from '../../../data/jp_points.js'
import METHOD from '../method/map.connection.method.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            seg: 360,
            count: 4
        }

        this.deg = 180 / this.param.seg
        this.draw = 0

        this.init(group)
    }


    // init
    init(group){
        this.create(group)

        const children = this.wrapper.children[0].children

        children.forEach(child => this.createTween(child))
    }


    // create
    create(group){
        const positionGroup = new THREE.Group()
        this.wrapper = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const {cx, cy, theta, radius} = METHOD.getCircleProp({coords: COORDS, ...CHILD_PARAM})
            // console.log(theta)

            const mesh = this.createLineMesh(radius)
            mesh.position.set(cx, cy, 0)
            mesh.rotation.x = 90 * RADIAN
            mesh.rotation.y = theta

            positionGroup.add(mesh)
        }

        positionGroup.position.set(CHILD_PARAM.width / -2, CHILD_PARAM.height / 2 + CHILD_PARAM.y, 50)

        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    // line
    createLineMesh(radius){
        const geometry = this.createLineGeometry(radius)
        const material = this.createLineMaterial()
        return new THREE.Line(geometry, material)
    }
    createLineGeometry(radius){
        const position = new Float32Array(this.param.seg * 3)

        for(let i = 0; i < this.param.seg; i++){
            const x = Math.cos(i * this.deg * RADIAN) * radius
            const y = Math.sin(i * this.deg * RADIAN) * radius
            position[i * 3] = x
            position[i * 3 + 1] = y
            position[i * 3 + 2] = 0
        }

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        geometry.setDrawRange(0, 0)

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
    createTween(mesh){
        const start1 = {draw: 0}
        const end1 = {draw: this.param.seg}

        const start2 = {draw: this.param.seg}
        const end2 = {draw: 0}

        const tw1 = new TWEEN.Tween(start1)
        .to(end1, 2000)
        .delay(Math.random() * 3000)
        .onUpdate(() => this.updateTween(mesh, start1))
        .onComplete(() => this.completeTween1(mesh))

        const tw2 = new TWEEN.Tween(start2)
        .to(end2, 2000)
        .delay(2000)
        .onUpdate(() => this.updateTween(mesh, start2))
        .onComplete(() => this.completeTween2(mesh))

        tw1.chain(tw2)
        tw1.start()
    }
    updateTween(mesh, {draw}){
        mesh.geometry.setDrawRange(0, draw)
    }
    completeTween1(mesh){
        mesh.rotation.y += 180 * RADIAN
    }
    completeTween2(mesh){
        const {cx, cy, theta, radius} = METHOD.getCircleProp({coords: COORDS, ...CHILD_PARAM})

        mesh.position.set(cx, cy, 0)
        mesh.rotation.y = theta

        mesh.geometry.dispose()
        mesh.geometry = this.createLineGeometry(radius)

        this.createTween(mesh)
    }


    // animate
}