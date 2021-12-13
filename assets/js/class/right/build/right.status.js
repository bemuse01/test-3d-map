// import LEFT_METHOD from '../../left/method/left.text.method.js'

class RightStatusBuild{
    constructor(){
        this.len = 7
        this.el = []

        this.init()
        this.timer = 2000
        this.play = false

        this.currentTime = window.performance.now()
        this.oldTime = window.performance.now()
    }


    // init
    init(){
        this.create()
    }


    // open
    open(){
        this.el.forEach(e => {
            e.child.forEach(c => {
                c.style.topText.animation = `blank 0.1s ${Math.random() * 0.5 + c.num / 10}s 3 linear forwards`
                c.style.border.animation = `blank 0.1s ${Math.random() * 0.5 + c.num / 10}s 3 linear forwards`
                c.style.topGraph.forEach(tg => {
                    const scaleY = Math.random() * 0.8 + 0.2
                    tg.transform = `scaleY(${scaleY})`
                    tg.backgroundColor = `rgba(50, 234, 255, ${scaleY})`
                })
                c.style.bottom.forEach(bt => {
                    const scaleX = Math.random() * 0.8 + 0.2
                    bt.transform = `scaleX(${scaleX})`
                    bt.backgroundColor = `rgba(50, 234, 255, ${scaleX})`
                })
            })
        })

        this.play = true

        setTimeout(() => this.setInterval(), this.timer)
    }


    // create
    create(){
        let count = 0

        this.el = Array.from({length: this.len}, (_, i) => ({
            key: i,
            child: Array.from({length: i % 2 === 0 ? 2 : 1}, (_, j) => ({
                key: j,
                name: 'F - ' + count++,
                uuid: LeftTextMethod.createUuid(1),
                dist: 0,
                num: count,
                style: {
                    topText: {
                        opacity: '0',
                        animation: 'none'
                    },
                    topGraph: Array.from({length: 5}, () => {
                        return {
                            height: `100%`,
                            transformOrigin: 'top',
                            transform: 'scaleY(0)',
                            backgroundColor: `rgba(50, 234, 255, 0)`,
                            transition: `transform 0.3s ${Math.random() * 0.5 + count / 10}s`
                        }
                    }),
                    border: {
                        opacity: '0',
                        animation: 'none'
                    },
                    bottom: Array.from({length: 3}, () => {
                        return {
                            width: `100%`,
                            transformOrigin: 'left',
                            transform: 'scaleX(0)',
                            backgroundColor: `rgba(50, 234, 255, 0)`,
                            transition: `transform 0.3s ${Math.random() * 0.5 + count / 10}s`
                        }
                    })
                }
            }))
        }))
    }


    // interval
    // setInterval(){
    //     this.currentTime = window.performance.now()
    //     if(this.currentTime - this.oldTime > this.timer){
    //         this.changeStyle()
    //         this.oldTime = this.currentTime
    //     }
    // }
    setInterval(){
        this.changeStyle()

        setTimeout(() => this.setInterval(), this.timer);
    }
    changeStyle(){
        this.timer = Math.random() * 1000 + 1000

        this.el.forEach(el => {

            el.child.forEach(child => {

                if(Math.random() > 0.5){

                    child.dist = (Math.random() * 200).toFixed(2)

                    const {topGraph, bottom} = child.style

                    topGraph.forEach(tg => {
                        const scaleY = Math.random() * 0.8 + 0.2
                        tg.transform = `scaleY(${scaleY})`
                        tg.transition = `0.3s ${Math.random() * 0.5}s`
                        tg.backgroundColor = `rgba(50, 234, 255, ${scaleY})`
                    })
                    
                    bottom.forEach(bt => {
                        const scaleX = Math.random() * 0.8 + 0.2
                        bt.transform = `scaleX(${scaleX})`
                        bt.transition = `0.3s ${Math.random() * 0.5}s`
                        bt.backgroundColor = `rgba(50, 234, 255, ${scaleX})`
                    })

                }

            })

        })

    }


    // animate
    // animate({currentDist}){
    //     // if(!this.play){
    //     //     this.oldTime = window.performance.now()
    //     //     return
    //     // }

    //     if(!currentDist) return

    //     // this.setInterval()

    //     let count = 0

    //     this.el.forEach(el => {
    //         el.child.forEach(child => {
    //             child.dist = ~~(currentDist[count++] / 5)
    //         })
    //     })
    // }


    // get
    get(){
        return this.el
    }
}