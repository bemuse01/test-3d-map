class LeftClockBuild{
    constructor(){
        this.style = {opacity: '0', animation: 'none'}

        this.sec = 0
        this.min = 0
        this.hour = 0

        this.init()
    }


    // init
    init(){
        this.setInterval()
    }


    // open
    open(){
        this.style.animation = `blank 0.05s 3 ${Math.random()}s linear forwards`
    }


    // get
    getCurrentTime(){
        return `${this.addZero(this.hour)}:${this.addZero(this.min)}:${this.addZero(this.sec)}`
    }


    // util
    addZero(time){
        return ('' + time).length < 2 ? '0' + time : '' + time
    }


    // interval
    setInterval(){
        const date = new Date()

        this.sec = date.getSeconds()
        this.min = date.getMinutes()
        this.hour = date.getHours()
        
        setTimeout(() => this.setInterval(), 1000)
    }
}