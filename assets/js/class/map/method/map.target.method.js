import * as THREE from '../../../lib/three.module.js'
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

        const dist = Math.sqrt((-x - x) ** 2 + (-y - y) ** 2)

        return {x, y, theta, dist}
    },
    createLineAttribute({x, y, gap}){
        if(!x || !y) return {position: new Float32Array(0, 0, 0, 0, 0, 0), draw: undefined}
      
        const dist = Math.abs(x) * 2
        const g = dist * gap
        const len = ~~(dist / g)
        const sign = -Math.sign(x)

        const position = new Float32Array(len * 3)

        for(let i = 0; i < len; i++){
            const nx = x + g * i * sign
            const r = PUBLIC_METHOD.linearInterpolate(x, -x, nx)
            const ny = y + (-y - y) * r

            position[i * 3] = nx
            position[i * 3 + 1] = ny
        }

        return {position, draw: len}
    },
    createCanvasTexture({width, height}){
        const ctx = document.createElement('canvas').getContext('2d')
        ctx.canvas.width = width
        ctx.canvas.height = height
        return ctx
    },
    drawCanvasTexture(ctx, txt1, txt2, {font, fontColor, fontSize}){
        const {width, height} = ctx.canvas

        ctx.clearRect(0, 0, width, height)

        ctx.font = `${fontSize} ${font}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = fontColor
        // ctx.fillText(~~(window.performance.now()), width / 2, height / 2)
        ctx.fillText(txt1, width / 2, height / 2)
        ctx.fillText(txt1, width / 2, height / 2)
        ctx.fillText(txt2, width / 2, height / 2 - 10)
        ctx.fillText(txt2, width / 2, height / 2 - 10)
    }
}