// import Spline from '../../../lib/cubic-spline.js'

const LeftVisualizerMethod = {
    createStepAudioBuffer({data, count, step}){
        const temp = []

        for(let i = 0; i < count; i++){
            temp.push(data[i * step])
        }

        return temp
    },
    createAudioBuffer({sample = [], index = [], smooth = 0.1, boost = 1, height, rd}){
        const len = sample.length
        const temp = []

        const xs = index
        const ys = sample
        const spline = new Spline(xs, ys)
        
        for(let i = 0; i < len; i++){
            temp.push(spline.at(i * smooth) * boost)
        }

        const avg = temp.reduce((x, y) => x + y) / len * rd
        return temp.map(e => Math.max(0, e - avg ))
        // return temp
        // return temp.map(e => PUBLIC_METHOD.normalize(e, 0, height / 2, 0, 255))
    },
    drawCanvas({ctx, color, count, buffer, width, height, gap}){
        const g = (width * gap) / (count - 1)
        const size = (width - width * gap) / count

        ctx.clearRect(0, 0, width, height)

        for(let i = 0; i < count; i++){
            const buf = buffer[i]
            const alpha = (buf / (height / 2)) * 0.6 + 0.4
            ctx.beginPath()
            ctx.rect(i * size + i * g, 0, size, buf)
            ctx.fillStyle = `rgba(${color}, ${alpha})`
            ctx.fill()
        }
    }
}