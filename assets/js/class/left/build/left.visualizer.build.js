// import METHOD from '../method/left.visualizer.method.js'

class LeftVisulizerBuild{
    constructor(){
        this.canvas = document.querySelector('.left-player-visualizer > canvas')
        this.ctx = this.canvas.getContext('2d')

        this.param = {
            count: 50,
            step: 100,
            gap: 0.2,
            smooth: 0.2,
            rd: 0.8,
            color: '50, 234, 255'
        }

        this.index = Array.from({length: this.param.count}, (_, i) => i)
    }


    // animate
    animate({player}){
        const {audioData} = player
        if(!audioData) return

        const {width, height} = this.canvas.getBoundingClientRect()
        const sample = LeftVisualizerMethod.createStepAudioBuffer({data: audioData, ...this.param})
        const buffer = LeftVisualizerMethod.createAudioBuffer({sample, index: this.index, height, ...this.param})
        
        LeftVisualizerMethod.drawCanvas({ctx: this.ctx, ...this.param, width, height, buffer})
    }
}