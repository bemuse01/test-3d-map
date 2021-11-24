import PUBLIC_METHOD from '../../../method/method.js'

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

        const v1 = {x: pp1.x - cx, y: pp1.y - cy}
        const v2 = {x: pp1.x + cx, y: 0}
        const theta = PUBLIC_METHOD.getCrossLineTheta(v1, v2)
    
        return {theta, radius, cx, cy, dest: pp2}
    }
}