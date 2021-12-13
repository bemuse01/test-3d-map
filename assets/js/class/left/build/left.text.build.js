// import METHOD from '../method/left.text.method.js'

class LeftTextBuild{
    constructor({type, count, proxy}){
        this.parentProxy = proxy

        this.type = type
        this.auth = LeftTextMethod.createAuth(type)

        this.iter = 6
        this.load = [
            Array.from({length: this.iter}, () => '-'), 
            Array.from({length: this.iter}, () => '\\'), 
            Array.from({length: this.iter}, () => '|'), 
            Array.from({length: this.iter}, () => '/'), 
        ].flat()
        this.loadIdx = 0

        this.len = count
        this.el = []

        this.currentTime = window.performance.now()
        this.oldTime = window.performance.now()
        this.playInterval = true
        this.timer = Math.random() * 500 + 500

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.el = Array.from({length: this.len}, (_, i) => ({
            key: i,
            text: '',
            style: {
                opacity: 1 - 1 / this.len * i,
            }
        }))
    }

    // interval
    setInterval(){
        this.currentTime = window.performance.now()
        if(this.currentTime - this.oldTime > this.timer){
            this.logTexts()
            this.oldTime = this.currentTime
        }
    }
    logTexts(){
        this.timer = Math.random() * 500 + 500
        this.auth = LeftTextMethod.createAuth(this.type)
        
        const temp = this.el.map((e, i) => i === 0 ? e.text.slice(0, e.text.length - 1) + 'ok' : e.text)
        
        for(let i = 1; i < this.el.length; i++){
            this.el[i].text = temp[i - 1]
        }
    }


    // animate
    animate(){
        if(!this.parentProxy.play){
            this.oldTime = window.performance.now()
            return
        }

        this.animateText()
        this.setInterval()
    }
    animateText(){
        this.el[0].text = `${this.auth}... ${this.load[this.loadIdx]}`

        this.loadIdx = (this.loadIdx + 1) % this.load.length
    }


    // get
    get(){
        return this.el
    }
}