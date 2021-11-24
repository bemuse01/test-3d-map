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
            count: 12,
            gap: 0.005
        }

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
        this.initTween()
    }


    // create
    create(group){
        const positionGroup = new THREE.Group()
        this.wrapper = new THREE.Group()

        for(let i = 0; i < this.param.count; i++){
            const local = new THREE.Group()
            
            // const {x, y, theta} = METHOD.createRoute(this.param)

            // line
            const line = this.createLineMesh()
            // line.position.set(x, y, 0)
            // line.rotation.z = theta
            local.add(line)


            // tri
            const tri = this.createTriMesh()
            // tri.position.set(x, y, 0)
            // tri.rotation.z = theta + 90 * RADIAN
            local.add(tri)

            local.position.set(Math.random() * this.param.width - this.param.width / 2, Math.random() * this.param.height - this.param.height / 2, 0)

            positionGroup.add(local)
            // positionGroup.add(line)
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
            opacity: 0.5,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })
    }



    // tween
    initTween(){
        const children = this.wrapper.children[0].children

        children.forEach(local => this.createMoveTween(local))
    }
    // open
    createOpenTween(){
        
    }
    // move
    createMoveTween(group){
        const {x, y, theta, dist} = METHOD.createRoute(this.param)

        const [line, tri] = group.children

        const start = {x: x, y: y}
        const end = {x: -x, y: -y}

        const tw = new TWEEN.Tween(start)
        .to(end, 120000 + dist * 2)
        .onStart(() => this.startMoveTween({tri, line, x, y, theta}))
        .onUpdate(() => this.updateMoveTween({tri, line, dist, start, x, y}))
        .start()
    }
    startMoveTween({tri, line, x, y, theta}){
        tri.position.set(x, y, 0)
        tri.rotation.z = theta + 90 * RADIAN
        
        line.geometry.dispose()
        line.geometry = this.createLineGeometry({x, y})

        // line.position.set(x + Math.sign(x) * x / 2, y + Math.sign(x) * y / 2, 0)
        // line.rotation.z = theta
    }
    updateMoveTween({tri, line, dist, start, x, y}){
        const currentDist = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2)

        // console.log(currentDist / dist)

        tri.position.set(start.x, start.y, 0)
        line.geometry.setDrawRange(0, currentDist / dist * line.geometry.draw)
    }
}