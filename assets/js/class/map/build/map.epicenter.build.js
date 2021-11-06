import * as THREE from '../../../lib/three.module.js'
import COORDS from '../../../data/points.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0xff3232,
            count: 4,
            size: 10,
            seg: 16,
            z: 50
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
        this.rotationGroup = new THREE.Group()
        const {coordinates} = COORDS

        for(let i = 0; i < this.param.count; i++){
            const {rx, ry} = coordinates[~~(Math.random() * coordinates.length)]

            const x = rx * CHILD_PARAM.width
            const y = ry * -CHILD_PARAM.height

            const mesh = this.createMesh()

            mesh.position.set(x, y, this.param.z)

            positionGroup.add(mesh)
        }

        positionGroup.position.set(CHILD_PARAM.width / -2, CHILD_PARAM.height / 2, 0)

        this.rotationGroup.rotation.x = CHILD_PARAM.rotation * RADIAN

        this.rotationGroup.add(positionGroup)
        group.add(this.rotationGroup)
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
            opacity: 1.0
        })
    }
    // tween
    createTween(){
        const children = this.rotationGroup.children[0].children

        children.forEach((child, i) => {
            const start = {opacity: 0, scale: 1}
            const end = {opacity: [0, 0.5, 1, 0.5, 0], scale: 3}

            const tw = new TWEEN.Tween()
        })
    }


    // animate
    animate(){
        this.rotationGroup.rotation.z += 0.002
    }
}