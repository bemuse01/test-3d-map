class RightDateBuild{
    constructor(){
        this.style = {opacity: '0', animation: 'none'}

        this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        this.day = 0
        this.date = 0
        this.month = 0
        this.year = 0

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


    // create
    create(){
        
    }


    // get
    getCurrentDate(){
        return `${this.year}.${this.addZero(this.month)}.${this.addZero(this.date)}.${this.days[this.day]}`
    }


    // util
    addZero(time){
        return ('' + time).length < 2 ? '0' + time : '' + time
    }


    // interval
    setInterval(){
        const date = new Date()

        this.day = date.getDay()
        this.date = date.getDate()
        this.month = date.getMonth() + 1
        this.year = date.getFullYear()

        setTimeout(() => this.setInterval(), 1000)
    }
}