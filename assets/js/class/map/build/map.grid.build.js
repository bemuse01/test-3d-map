import * as THREE from '../../../lib/three.module.js'
import CHILD_PARAM from '../param/map.child.param.js'
import SHADER from '../shader/map.grid.shader.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            width: 1600,
            height: 1600,
            seg: 12 - 1,
            zdist: 120
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
            const y = offset + gap * i

            const xmesh = this.createMesh([x, -offset, 0, x, offset, 0])
            const ymesh = this.createMesh([-offset, y, 0, offset, y, 0])

            positionGroup.add(xmesh)
            positionGroup.add(ymesh)
        }

        for(let i = 0; i < this.param.seg + 1; i++){
            for(let j = 0; j < this.param.seg + 1; j++){
                const x = offset + gap * i
                const y = offset + gap * j

                const mesh = this.createMesh([x, y, this.param.zdist, x, y, 0])

                positionGroup.add(mesh)
            }
        }
                
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
        // return new THREE.LineBasicMaterial({
        //     color: this.param.color,
        //     transparent: true,
        //     depthTest: false,
        //     depthWrite: false,
        //     opacity: 0.2
        // })
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.vertex,
            fragmentShader: SHADER.fragment,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uDist: {value: this.param.width / 2.0},
                uOpacity: {value: 0.4},
                uZdist: {value: this.param.zdist}
            }
        })
    }
}