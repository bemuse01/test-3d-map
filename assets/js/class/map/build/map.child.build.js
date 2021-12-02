import * as THREE from '../../../lib/three.module.js'
import PUBLIC_METHOD from '../../../method/method.js'
import METHOD from '../method/map.child.method.js' 
import PARAM from '../param/map.child.param.js'

export default class{
    constructor({group, map, parent, proxy}){
        this.map = map

        this.index = METHOD.createIndex(~~(this.map.coordinates.length * PARAM.div), this.map.coordinates.length)

        this.parent = parent
        this.parentProxy = proxy

        // this.init(group)
    }


    // init
    init(group){
        this.create(group)
        this.createOpenTween()
    }


    // open
    open(group){
        this.index = METHOD.createIndex(~~(this.map.coordinates.length * PARAM.div), this.map.coordinates.length)

        this.init(group)
    }


    // close
    close(group){
        this.createCloseTween(group)
    }


    // create
    create(group){
        const positionGroup = new THREE.Group()
        this.wrapper = new THREE.Group()
        const plane = this.createPlaneMesh()

        this.setMeshProps(plane)
        
        positionGroup.position.set(PARAM.width / -2, PARAM.height / 2 + PARAM.y, 0)

        positionGroup.add(plane)
        this.wrapper.add(positionGroup)
        group.add(this.wrapper)
    }
    // plane
    createPlaneMesh(){
        const geometry = this.createPlaneGeometry()
        const material = this.createPlaneMaterial()
        return new THREE.InstancedMesh(geometry, material, this.map.coordinates.length)
    }
    createPlaneGeometry(){
        return new THREE.BoxGeometry(PARAM.size, PARAM.size, PARAM.size)
    }
    createPlaneMaterial(){
        return new THREE.MeshBasicMaterial({
            // color: PARAM.color,
            transparent: true,
            opacity: 1.0,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })
    }
    setMeshProps(plane){
        plane.colors = []

        this.map.coordinates.forEach((data, i) => {
            const {rx, ry} = data

            const x = rx * PARAM.width
            const y = ry * -PARAM.height

            const matrix = new THREE.Matrix4()
            
            const noise = SIMPLEX.noise3D(x * 0.005, y * 0.01, window.performance.now() * 0.001)
            const scale = PUBLIC_METHOD.normalize(noise, 0.1, 4, -1, 1)
            const color = Math.floor(PUBLIC_METHOD.normalize(noise, 3, 35, -1, 1)) * (Math.random() > 0.9 ? 2 : 1)
            
            matrix.multiply(new THREE.Matrix4().makeTranslation(x, y, 0))
            matrix.multiply(new THREE.Matrix4().makeScale(1, 1, scale))
            matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, PARAM.size / 2))

            plane.setMatrixAt(i, matrix)
            plane.setColorAt(i, new THREE.Color(`hsl(186, 100%, 0%)`))
            plane.colors.push(color)

            // if(i === 80 || i === 503) plane.setColorAt(i, new THREE.Color(0xffffff))
            
            // edge
            // const planeEdge = this.createEdgeMesh(new THREE.BoxGeometry(PARAM.size, PARAM.size, PARAM.size))
            // planeEdge.applyMatrix4(matrix)

            // positionGroup.add(planeEdge)
        })

        plane.instanceColor.needsUpdate = true
        plane.instanceMatrix.needsUpdate = true
    }
    // plane edge
    createEdgeMesh(geo){
        const geometry = this.createEdgeGeometry(geo)
        const material = this.createEdgeMaterial()
        return new THREE.LineSegments(geometry, material)
    }
    createEdgeGeometry(geo){
        return new THREE.EdgesGeometry(geo)
    }
    createEdgeMaterial(){
        return new THREE.LineBasicMaterial({
            color: PARAM.color,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            opacity: 0.5
        })
    }
    

    // tween
    // open tween
    createOpenTween(){
        const plane = this.wrapper.children[0].children[0]

        this.index.forEach((indices, i) => {
            const start = {light: 0}
            const end = {light: [1, 0, 1, 0, 1]}
            
            const tw = new TWEEN.Tween(start)
            .to(end, 200)
            .onUpdate(() => this.updateTween(plane, indices, start))
            .onComplete(() => this.completeOpenTween(i === this.index.length - 1))
            .delay(20 * i)
            .start()
        })
    }
    updateTween(plane, indices, {light}){
        indices.forEach(i => {
            plane.setColorAt(i, new THREE.Color(`hsl(186, 100%, ${~~(plane.colors[i] * light)}%)`))
        })
        plane.instanceColor.needsUpdate = true
    }
    completeOpenTween(isLast){
        if(isLast){
            this.parentProxy.child = true
        }
    }
    // close tween
    createCloseTween(group){
        const plane = this.wrapper.children[0].children[0]

        this.index.forEach((indices, i) => {
            const start = {light: 0}
            const end = {light: [0, 1, 0]}
            
            const tw = new TWEEN.Tween(start)
            .to(end, 100)
            .onUpdate(() => this.updateTween(plane, indices, start))
            .onComplete(() => this.completeCloseTween(group, i === this.index.length - 1))
            .delay(20 * i)
            .start()
        })
    }
    completeCloseTween(group, isLast){
        if(isLast){
            this.dispose(group)
            // this.parent.setProxyToFalse()
            this.open(group)
        }
    }


    // dispose
    dispose(group){
        const plane = this.wrapper.children[0].children[0]
        plane.geometry.dispose()
        plane.material.dispose()

        const positionGroup = this.wrapper.children[0]
        positionGroup.clear()

        this.wrapper.clear()
        this.wrapper = null

        group.clear()
    }


    // set
    setMap(map){
        this.map = map
    }
}