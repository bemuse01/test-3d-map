import * as THREE from '../../../lib/three.module.js'
import COORDS from '../../../data/jp_points.js'
import METHOD from '../method/map.connection.method.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            seg: 360,
            count: 5,
            radius: 6
        }

        this.deg = 180 / this.param.seg
        this.draw = 0

        this.init(group)
    }


    // init
    init(group){
        this.create(group)

        const lines = this.wrapper.children[0].children[0].children
        const circles = this.wrapper.children[0].children[1].children

        lines.forEach((line, i) => this.createLineTween(line, circles[i]))
    }


    // create
    create(group){
        const positionGroup = new THREE.Group()
        const lineGroup = new THREE.Group()
        const circleGroup = new THREE.Group()
        this.wrapper = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            // line
            const line = this.createLineMesh(1)
            line.rotation.x = 90 * RADIAN
            lineGroup.add(line)

            // circle
            const circle = this.createCircleMesh()
            circle.scale.set(0, 0, 0)
            circleGroup.add(circle)
        }

        positionGroup.position.set(CHILD_PARAM.width / -2, CHILD_PARAM.height / 2 + CHILD_PARAM.y, 50)

        positionGroup.add(lineGroup)
        positionGroup.add(circleGroup)
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
    // circle
    createCircleMesh(){
        const geometry = this.createCircleGeometry()
        const material = this.createCircleMaterial()
        return new THREE.Mesh(geometry, material)
    }
    createCircleGeometry(){
        return new THREE.CircleGeometry(this.param.radius, 16)
    }
    createCircleMaterial(){
        return new THREE.MeshBasicMaterial({
            color: this.param.color,
            side: THREE.DoubleSide,
            transparent: true
        })
    }


    // tween
    // line tween
    createLineTween(line, circle){
        const circleProp = METHOD.getCircleProp({coords: COORDS, ...CHILD_PARAM})

        const start1 = {draw: 0}
        const end1 = {draw: this.param.seg}

        const start2 = {draw: this.param.seg}
        const end2 = {draw: 0}

        const dist = circleProp.radius * 2
        const time = 2000 < dist ? dist : dist + 2000

        // enter
        const tw1 = new TWEEN.Tween(start1)
        .to(end1, time)
        .delay(Math.random() * 3000)
        .onStart(() => this.beforeLineTween(line, circleProp))
        .onUpdate(() => this.updateLineTween(line, start1))
        .onComplete(() => this.completeLineTween1(line, circle, circleProp))

        // leave
        const tw2 = new TWEEN.Tween(start2)
        .to(end2, time)
        .delay(Math.random() * 1000 + 1000)
        .onUpdate(() => this.updateLineTween(line, start2))
        .onComplete(() => this.completeLineTween2(line, circle))

        tw1.chain(tw2)
        tw1.start()
    }
    beforeLineTween(line, {cx, cy, theta, radius}){
        console.log(line)
        line.position.set(cx, cy, 0)
        line.rotation.y = theta

        line.geometry.dispose()
        line.geometry = this.createLineGeometry(radius)
    }
    updateLineTween(line, {draw}){
        line.geometry.setDrawRange(0, draw)
    }
    completeLineTween1(line, circle, {dest}){
        this.createCircleTween1(circle, dest.x, dest.y)
        line.rotation.y += 180 * RADIAN
    }
    completeLineTween2(line, circle){
        this.createLineTween(line, circle)
        this.createCircleTween2(circle)
    }
    // circle tween
    createCircleTween1(mesh, x, y){
        const start = {scale: 0}
        const end = {scale: 1}

        const tw = new TWEEN.Tween(start)
        .to(end, 200)
        .onStart(() => this.beforeCircleTween(mesh, x, y))
        .onUpdate(() => this.updateCircleTween(mesh, start))
        .start()
    }
    createCircleTween2(mesh){
        const start = {scale: 1}
        const end = {scale: 0}

        const tw = new TWEEN.Tween(start)
        .to(end, 200)
        .onUpdate(() => this.updateCircleTween(mesh, start))
        .start()
    }
    updateCircleTween(mesh, {scale}){
        mesh.scale.set(scale, scale, 0)
    }
    beforeCircleTween(mesh, x, y){
        mesh.position.set(x, y, 0)
    }


    // animate
}