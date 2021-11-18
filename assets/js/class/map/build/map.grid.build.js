import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0x32eaff,
            width: 1000,
            height: 1000,
            seg: 32 - 1
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

        const plane = new THREE.PlaneGeometry(this.param.width, this.param.height, this.param.seg, this.param.seg)
        

        console.log(plane)

        // for(let i = 0; i < this.param.seg; i++){
        //     const mesh = this.createMesh()



        //     positionGroup.add(mesh)
        // }

        // for(let i = 0; i < plane.length / 3; i++){
        //     const mesh = this.createMesh()

        //     positionGroup.add(mesh)

        // }
                
        // positionGroup.position.set(0, PARAM.y, 0)

        // positionGroup.add(plane)
        // this.wrapper.add(positionGroup)
        // group.add(this.wrapper)
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        return new THREE.Line(geometry, material)
    }
    createGeometry(position){
        const geometry = new THREE.BufferGeometry()
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position, 3)))

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