import PUBLIC_METHOD from '../../../method/method.js'

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

        const v1 = {x, y}
        const v2 = {x: Math.abs(x), y: 0}
        const theta = PUBLIC_METHOD.getCrossLineTheta(v1, v2)

        return {x, y, theta}
    }
}