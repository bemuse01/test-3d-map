export default class{
    constructor({proxy}){
        this.parentProxy = proxy
        this.element = document.querySelector('.open-text')

        this.iter = 6
        this.load = [
            Array.from({length: this.iter}, () => '-'), 
            Array.from({length: this.iter}, () => '\\'), 
            Array.from({length: this.iter}, () => '|'), 
            Array.from({length: this.iter}, () => '/'), 
        ].flat()
        this.loadIdx = 0

        this.texts = [
            'Checking authority...',
            'Intializing system...',
            'Optimizing system...',
            'Checking data...',
            'Accessing data...',
            'Synchronizing data...',
            'Loading data...',
            'Waiting...',
            'Complete.'
        ]

        this.len = this.texts.length
        this.el = []
        this.currentIdx = 0
        this.y = (this.len * 100 / 2) / this.len
        this.ry = (this.len * 100) / this.len

        this.currentTime = window.performance.now()
        this.oldTime = window.performance.now()
        this.playInterval = true

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.el = this.texts.map((text, i) => ({
            key: i,
            text,
            loading: '',
            style: {
                opacity: i === this.currentIdx ? 1 : 0,
                transform: `translateY(${this.y * this.len}%)`
            },
            timer: Math.random() * 900 + 100,
            done: i === this.len - 1 ? '' : 'ok'
        }))
    }


    // interval
    setInterval(){
        this.currentTime = window.performance.now()
        if(this.currentTime - this.oldTime > this.el[this.currentIdx].timer){
            this.showLoadingTexts()
            this.oldTime = this.currentTime
        }
    }
    showLoadingTexts(){
        this.currentIdx++

        this.el.forEach((e, i) => {
            if(i > this.currentIdx) e.style.opacity = 0
            else if(i === this.currentIdx) e.style.opacity = 1
            else e.style.opacity = 1 - (this.currentIdx - i) * 0.2

            e.style.transform = `translateY(${this.y * this.len - 100 * this.currentIdx}%)`
        })
    }


    // animate
    animate(){
        if(!this.playInterval) return

        this.playLoading()
        this.setInterval()
    }
    playLoading(){
        this.el.forEach((e, i) => {
            if(i === this.currentIdx) e.loading = this.load[this.loadIdx]
            else e.loading = e.done
            
            if(i === this.currentIdx && this.currentIdx === this.len - 1) {
                e.loading = e.done
                this.createTween()
                this.playInterval = false
            }
        })

        this.loadIdx = (this.loadIdx + 1) % this.load.length
    }


    // tween
    createTween(){
        const start = {opacity: 1}
        const end = {opacity: [0, 1, 0, 1, 0, 1, 0]}

        const tw = new TWEEN.Tween(start)
        .delay(1000)
        .to(end, 250)
        .onUpdate(() => this.updateTween(start))
        .onComplete(() => this.completeTween())
        .start()
    }
    updateTween({opacity}){
        this.element.style.opacity = opacity
    }
    completeTween(){
        // setTimeout(() => this.parentProxy.text = true, 600)
        // this.parentProxy.text = true
        this.parentProxy.text = true
    }


    // get
    get(){
        return this.el
    }
}