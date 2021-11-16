import * as THREE from '../../../lib/three.module.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group, map, parent, proxy}){
        this.param = {
            color: 0xff3232,
            count: 8,
            iter: 4,
            size: 10,
            seg: 32,
            z: 50
        }

        this.map = map

        this.play = Array.from({length: this.param.count}, () => true)
        
        this.parent = parent
        this.parentProxy = proxy

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
        const {coordinates} = this.map

        for(let i = 0; i < this.param.count; i++){
            const random = ~~(Math.random() * coordinates.length)

            const local = new THREE.Group()

            const {rx, ry} = coordinates[random]

            const x = rx * CHILD_PARAM.width
            const y = ry * -CHILD_PARAM.height

            for(let j = 0; j < this.param.iter; j++){
                const mesh = this.createMesh()
                mesh.position.set(x, y, this.param.z)
                
                local.add(mesh)
            }

            positionGroup.add(local)
        }

        positionGroup.position.set(CHILD_PARAM.width / -2, CHILD_PARAM.height / 2 + CHILD_PARAM.y, 0)

        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        return new THREE.Line(geometry, material)
    }
    createGeometry(){
        const position = [...new THREE.CircleGeometry(this.param.size, this.param.seg).attributes.position.array.slice(3)]
        position.push(...position.slice(0, 3))

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position), 3))

        return geometry
    }
    createMaterial(){
        return new THREE.LineBasicMaterial({
            color: this.param.color,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            opacity: 0
        })
    }


    // tween
    initTween(){
        const groups = this.wrapper.children[0].children
        
        groups.forEach((group, i) => this.createTween(group.children, i))
    }
    createTween(children, idx){
        this.play[idx] = true

        children.forEach((child, i) => {
            const start = {opacity: 0, scale: 0.2}
            const end = {opacity: [0, 0.25, 0.5, 1, 0.5, 0], scale: 5}

            const tw = new TWEEN.Tween(start)
            .to(end, 1000)
            .onUpdate(() => this.updateTween(child, start))
            .delay(i * 200 + idx * 300)
            .onComplete(() => this.completeTween(children, i === this.param.iter - 1, idx))
            .start()
        })
    }
    updateTween(child, start){
        const {opacity, scale} = start
        
        child.scale.set(scale, scale, 1)
        child.material.opacity = opacity
    }
    completeTween(children, isLast, idx){
        if(isLast){
            if(!this.parent.play){
                this.play[idx] = false
                if(this.isAllTweenStop()) this.parentProxy.epicenter = true
                return
            }

            const {coordinates} = this.map
            const random = ~~(Math.random() * coordinates.length)
    
            children.forEach(child => {
                const {rx, ry} = coordinates[random]
    
                const x = rx * CHILD_PARAM.width
                const y = ry * -CHILD_PARAM.height
    
                child.position.set(x, y, this.param.z)
            })

            this.createTween(children, idx)
        }
    }
    isAllTweenStop(){
        return this.play.every(e => e === false)
    }


    // set
    setMap(map){
        this.map = map
    }
}