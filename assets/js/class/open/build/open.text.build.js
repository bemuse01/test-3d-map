export default class{
    constructor(){
        this.iter = 6
        this.load = [
            Array.from({length: this.iter}, () => '-'), 
            Array.from({length: this.iter}, () => '\\'), 
            Array.from({length: this.iter}, () => '|'), 
            Array.from({length: this.iter}, () => '/'), 
        ].flat()
        this.loadIdx = 0

        this.texts = [
            'Intializing system...',
            'Optimizing system...',
            'Accessing data...',
            'Synchronizing targets...',
            'Loading maps...',
            'Waiting...',
            'Complete.'
        ]

        this.len = this.texts.length
        this.el = []
        this.currentIdx = 0
        this.y = (this.len * 100 / 2) / this.len
        this.ry = (this.len * 100) / this.len

        // this.init()
    }


    // init
    init(){
        this.create()
        setTimeout(() => this.setTimer(), 1000) 
    }


    // create
    create(){
        this.el = this.texts.map((text, i) => ({
            key: i,
            text,
            loading: '',
            style: {
                opacity: i === this.currentIdx ? 1.0 : 0,
                transform: `translateY(${this.y * this.len}%)`
            },
            timer: Math.random() * 500 + 500,
            play: true
        }))
    }


    // timer
    setTimer(){
        this.currentIdx++

        this.el.forEach((e, i) => {
            if(i > this.currentIdx) e.style.opacity = 0
            else if(i === this.currentIdx) e.style.opacity = 1
            else e.style.opacity = 1 - (this.currentIdx - i) * 0.2

            e.style.transform = `translateY(${this.y * this.len - 100 * this.currentIdx}%)`
        })

        if(this.currentIdx === this.el.length - 1) return
        setTimeout(() => this.setTimer(), 1000)
    }


    // animate
    animate(){
        this.executeLoading()
    }
    executeLoading(){
        this.el.forEach(e => {
            e.loading = this.load[this.loadIdx]
        })

        this.loadIdx = (this.loadIdx + 1) % this.load.length
    }


    // get
    get(){
        return this.el
    }
}