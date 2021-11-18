import * as THREE from '../../../lib/three.module.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            width: 1400,
            height: 1400,
            seg: 10 - 1
        }

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

        const offset = this.param.width / -2
        const gap = this.param.width / this.param.seg

        for(let i = 0; i < this.param.seg + 1; i++){
            const x = offset + gap * i
            const y = 0

            const mesh = this.createMesh([0, -offset, 0, 0, offset, 0])

            mesh.position.set(x, y, 0)

            positionGroup.add(mesh)
        }

        // for(let i = 0; i < plane.length / 3; i++){
        //     const mesh = this.createMesh()

        //     positionGroup.add(mesh)

        // }
                
        positionGroup.position.set(0, CHILD_PARAM.y, 0)

        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    createMesh(position){
        const geometry = this.createGeometry(position)
        const material = this.createMaterial()
        return new THREE.Line(geometry, material)
    }
    createGeometry(position){
        const geometry = new THREE.BufferGeometry()
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position), 3))

        return geometry
    }
    createMaterial(){
        return new THREE.LineBasicMaterial({
            color: this.param.color,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            opacity: 0.25
        })
    }
}