import * as THREE from '../../../lib/three.module.js'

export default {
    getCenterPosition(p1, p2, {width, height}){
        const xdist = Math.abs(p1.rx - p2.rx) / 2
        const ydist = Math.abs(p1.ry - p2.ry) / 2
        const rx = Math.max(p1.rx, p2.rx) - xdist
        const ry = Math.max(p1.ry, p2.ry) - ydist
        return {cx: rx * width, cy: ry * -height}
    },
    getCircleProp({coords, width, height}){
        const p1 = coords.coordinates[~~(Math.random() * coords.coordinates.length)]
        const p2 = coords.coordinates[~~(Math.random() * coords.coordinates.length)]

        const pp1 = {x: p1.rx * width, y: p1.ry * -height}
        const pp2 = {x: p2.rx * width, y: p2.ry * -height}

        const {cx, cy} = this.getCenterPosition(p1, p2, {width, height})

        const radius = Math.sqrt((pp1.x - pp2.x) ** 2 + (pp1.y - pp2.y) ** 2) / 2

        const sign = Math.sign(pp1.y - cy)
        const v1 = new THREE.Vector2(pp1.x - cx, pp1.y - cy)
        const v2 = new THREE.Vector2(pp1.x + cx, 0)
        const out = v1.x * v2.x + v1.y * v2.y
        const dot = Math.sqrt(v1.x ** 2 + v1.y ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2)
        const theta = Math.acos(out / dot) * sign
    
        return {theta, radius, cx, cy}
    }
}