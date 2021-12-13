// import PLAYER from './build/left.player.build.js'
// import VISUALIZER from './build/left.visualizer.build.js'
// import CLOCK from './build/left.clock.build.js'
// import TEXT from './build/left.text.build.js'

class Left{
    constructor({musics}){
        this.musics = musics

        this.element = document.querySelector('.left')

        this.modules = {
            // player: {name: LeftPlayerBuild},
            visualizer: {name: LeftVisulizerBuild},
            clock: {name: LeftClockBuild},
            text: {
                name: LeftTextBuild,
                param: {
                    type: 'ip',
                    count: 14
                }
            },
            text2: {
                name: LeftTextBuild,
                param: {
                    type: 'uuid',
                    count: 10
                }
            },
            text3: {
                name: LeftTextBuild,
                param: {
                    type: 'encode',
                    count: 10
                }
            }
        }

        this.comp = {}

        this.init()
    }


    // init
    init(){
        this.initProxy()
        this.create()
    }
    initProxy(){
        const self = this
        
        const proxyObj = {
            play: false
        }

        this.proxy = new Proxy(proxyObj, {
            isAllTrue(obj){
                return Object.keys(obj).every(key => obj[key] === true)
            },
            set(obj, prop, value){
                obj[prop] = value

                if(this.isAllTrue(obj)){
                    self.open()
                }
                
                return true
            }
        })
    }


    // open
    open(){
        for(const comp in this.comp){
            if(!this.comp[comp].open) continue
            this.comp[comp].open()
        }
    }


    // create
    create(){
        this.createComponents()
    }
    createComponents(){
        for(const module in this.modules){
            const {name, param} = this.modules[module]
            const parameter = param ? param : {}

            this.comp[module] = new name({element: this.element, proxy: this.proxy, musics: this.musics, ...parameter})
        }
    }


    // animate
    animate(){
        for(const comp in this.comp){
            if(!this.comp[comp].animate) continue
            this.comp[comp].animate(this.comp)
        }
    }


    // get
    get(name){
        return this.comp[name].get()
    }
    getComp(name){
        return this.comp[name]
    }
}