import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            count: 4,
            size: 10,
            seg: 128
        }

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
        this.createTween()
    }


    // create
    create(group){
        this.wrapper = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const mesh = this.createMesh()

            this.wrapper.add(mesh)
        }

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
            opacity: 0
        })
    }


    // tween
    createTween(){
        const start = {opacity: 0, scale: 0.1}
        const end = {opacity: [0, 0.1, 0.2, 0.1, 0], scale: 80}
        const children = this.wrapper.children

        children.forEach((child, i) => {
            const tw = new TWEEN.Tween(start)
            .to(end, 6000)
            .onUpdate(() => this.updateTween(start, child))
            .onComplete(() => this.completeTween(i === this.param.count - 1))
            .delay(i * 1500)
            .start()
        })
    }
    updateTween(start, mesh){
        const {opacity, scale} = start
        
        mesh.scale.set(scale, scale, 1)
        mesh.material.opacity = opacity
    }
    completeTween(isLast){
        if(isLast){
            this.createTween()
        }
    }
}