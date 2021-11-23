import * as THREE from '../../../lib/three.module.js'
import METHOD from '../method/map.target.method.js'
import CHILD_PARAM from '../param/map.child.param.js'

export default class{
    constructor({group}){
        this.param = {
            color: 0xff3232,
            size: 40,
            z: 40,
            width: 800,
            height: 800,
            bound: 200,
            count: 1
        }

        this.init(group)
    }


    // init
    init(group){
        // this.create(group)
        // this.initTween()
    }


    // create
    create(group){
        const positionGroup = new THREE.Group()
        this.wrapper = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const {x, y, theta} = METHOD.createRoute(this.param)

            // tri
            const tri = this.createTriMesh()
            tri.position.set(x, y, 0)

            // line
            const line = this.createLineMesh()
            line.rotation.z = theta

            positionGroup.add(tri)
            positionGroup.add(line)
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
            opacity: 1.0,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })
    }
    // line
    createLineMesh(){
        const geometry = this.createLineGeometry()
        const material = this.createLineMaterial()
        return new THREE.Line(geometry, material)
    }
    createLineGeometry(){
        const geometry = new THREE.BufferGeometry()
        
        const position = new Float32Array([-800, 0, 0, 800, 0, 0])

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

        return geometry
    }
    createLineMaterial(){
        return new THREE.LineBasicMaterial({
            color: this.param.color,
            transparent: true,
            opacity: 1.0
        })
    }



    // tween
    initTween(){
        const children = this.wrapper.children[0].children

        children.forEach(child => this.createMoveTween(child))
    }
    // open
    createOpenTween(){
        
    }
    // move
    createMoveTween(mesh){
        const {x, y, theta} = METHOD.createRoute(this.param)

        mesh.rotation.z = theta

        const start = {x: x, y: y}
        const end = {x: -x, y: -y}

        const tw = new TWEEN.Tween(start)
        .to(end, 10000)
        .onUpdate(() => this.updateMoveTween(mesh, start))
        .start()
    }
    updateMoveTween(mesh, {x, y}){
        mesh.position.set(x, y, 0)
    }
}