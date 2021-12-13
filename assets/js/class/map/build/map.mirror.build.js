// import * as THREE from '../../../lib/three.module.js'
// import {Reflector} from '../../../lib/Reflector.js'
// import CHILD_PARAM from '../param/map.child.param.js'

class MapMirrorBuild{
    constructor({group, size}){
        this.param = {
            opacity: 0.25
        }

        this.size = size

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
        
        const mesh = this.createMesh()

        positionGroup.position.z = -20

        positionGroup.add(mesh)
        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    createMesh(){
        const geometry = this.createGeometry()
        // const material = new THREE.MeshBasicMaterial()
        // return new THREE.Mesh(geometry, material)
        const reflector = this.createReflector(geometry)
        return reflector
    }
    createGeometry(){
        return new THREE.PlaneGeometry(MapChildParam.width * 2, MapChildParam.height * 2)
    }
    createReflector(geometry){
        return new THREE.Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: this.size.el.w * RATIO,
            textureHeight: this.size.el.h * RATIO,
            color: 0x777777,
            opacity: this.param.opacity
        })
    }
}