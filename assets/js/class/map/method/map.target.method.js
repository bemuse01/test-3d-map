import {Vector2} from '../../../lib/three.module.js'

export default {
    createAttribute({size}){
        const position = new Float32Array(3 * 3)

        const h = Math.sqrt(size ** 2 - (size / 2) ** 2)
        const half = h / 2

        position[0] = 0
        position[1] = half
        position[2] = 0

        position[3] = -size / 2
        position[4] = -half
        position[5] = 0

        position[6] = size / 2
        position[7] = -half
        position[8] = 0

        return {position}
    },
    createRoute({width, height, bound}){
        const rand = new Uint8Array(2)
        self.crypto.getRandomValues(rand)
        
        const xsign = Math.random() > 0.5 ? -1 : 1
        const ysign = Math.random() > 0.5 ? -1 : 1
        const x = ((rand[0] / 255) * (width - bound) + bound) * xsign
        const y = ((rand[1] / 255) * (height - bound) + bound) * ysign

        const sign = Math.sign(y)
        const v1 = new Vector2(x, y)
        const v2 = new Vector2(Math.abs(x), 0)
        const out = v1.x * v2.x + v1.y * v2.y
        const dot = Math.sqrt(v1.x ** 2 + v1.y ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2)
        const theta = Math.acos(out / dot) * sign

        return {x, y, theta}
    }
}