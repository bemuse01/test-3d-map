import * as THREE from '../../../lib/three.module.js'
import METHOD from '../method/map.target.method.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0xff3232,
            size: 30,
            z: 40,
            width: 500,
            height: 500,
            bound: 250,
            count: 12,
            gap: 0.005,
            lineOpacity: 0.5
        }

        this.tw = []

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
        // this.initTween()
    }


    // close
    close(){
        this.createCloseTween()
    }


    // create
    create(group){
        const positionGroup = new THREE.Group()
        this.wrapper = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const local = new THREE.Group()
            
            // line
            const line = this.createLineMesh()
            local.add(line)

            // tri
            const tri = this.createTriMesh()
            local.add(tri)

            local.position.set(Math.random() * this.param.width - this.param.width / 2, Math.random() * this.param.height - this.param.height / 2, 0)

            positionGroup.add(local)
        }

        positionGroup.position.set(0, CHILD_PARAM.y, this.param.z)

        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    // triangle
    createTriMesh(){
        const geometry = this.createTriGeometry()
        const material = this.createTriMaterial()
        return new THREE.Mesh(geometry, material)
    }
    createTriGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position} = METHOD.createAttribute(this.param)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createTriMaterial(){
        return new THREE.MeshBasicMaterial({
            color: this.param.color,
            transparent: true,
            opacity: 0,
            // depthWrite: false,
            // depthTest: false,
            // blending: THREE.AdditiveBlending
        })
    }
    // line
    createLineMesh(route = {}){
        const geometry = this.createLineGeometry(route)
        const material = this.createLineMaterial()
        return new THREE.Line(geometry, material)
    }
    createLineGeometry({x, y}){
        const geometry = new THREE.BufferGeometry()
        
        const {position, draw} = METHOD.createLineAttribute({x, y, ...this.param})

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        geometry.attributes.position.needsUpdate = true
        geometry.draw = draw

        geometry.setDrawRange(0, 0)

        return geometry
    }
    createLineMaterial(){
        return new THREE.LineBasicMaterial({
            color: this.param.color,
            transparent: true,
            opacity: this.param.lineOpacity,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })
    }



    // tween
    initTween(){
        // const children = this.wrapper.children[0].children

        // children.forEach(local => this.createMoveTween(local))

        // window.addEventListener('click', () => this.removeMoveTween())

        this.createOpenTween()
    }
    // open
    createOpenTween(){
        const children = this.wrapper.children[0].children

        children.forEach((group, i) => {
            const [line, tri] = group.children

            const route = METHOD.createRoute(this.param)

            const start = {opacity: 0}
            const end = {opacity: [1, 0, 1, 0, 1]}

            const tw = new TWEEN.Tween(start)
            .to(end, 200)
            .onStart(() => this.startOpenTween({tri, line, ...route}))
            .onUpdate(() => this.updateOpenTween(tri, start))
            .onComplete(() => this.completeOpenTween(line, tri, route, i))
            .delay(i * 50)
            .start()
        })
    }
    startOpenTween({tri, line, x, y, theta}){
        tri.position.set(x, y, 0)
        tri.rotation.z = theta + 90 * RADIAN
        
        line.geometry.dispose()
        line.geometry = this.createLineGeometry({x, y})
        line.material.opacity = this.param.lineOpacity
    }
    updateOpenTween(tri, {opacity}){
        tri.material.opacity = opacity
    }
    completeOpenTween(line, tri, route, idx){
        this.createMoveTween(line, tri, route, idx)
    }
    // close
    createCloseTween(){
        const children = this.wrapper.children[0].children

        children.forEach((group, i) => {
            const [line, tri] = group.children

            const route = METHOD.createRoute(this.param)

            const start = {opacity: 1}
            const end = {opacity: [0, 1, 0]}

            const tw = new TWEEN.Tween(start)
            .to(end, 100)
            .onStart(() => this.startCloseTween(line))
            .onUpdate(() => this.updateCloseTween(tri, start))
            .onComplete(() => this.completeCloseTween(line, tri, route, i))
            .delay(i * 50)
            .start()
        })
    }
    startCloseTween(line){
        line.material.opacity = 0
    }
    updateCloseTween(tri, {opacity}){
        tri.material.opacity = opacity
    }
    completeCloseTween(){
        this.removeMoveTween()
    }
    // move
    createMoveTween(line, tri, route, idx){
        const {x, y, dist} = route

        const start = {x: x, y: y}
        const end = {x: -x, y: -y}

        this.tw[idx] = new TWEEN.Tween(start)
        .to(end, 80000 + dist * 2)
        .onUpdate(() => this.updateMoveTween({tri, line, dist, start, x, y, idx}))
        .start()

    }
    updateMoveTween({tri, line, dist, start, x, y, idx}){
        const currentDist = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2)

        tri.position.set(start.x, start.y, 0)
        line.geometry.setDrawRange(0, currentDist / dist * line.geometry.draw)
    }
    removeMoveTween(){
        for(let i = 0; i < this.tw.length; i++){
            TWEEN.remove(this.tw[i])
            // this.tw[i] = null
        }
    }
}