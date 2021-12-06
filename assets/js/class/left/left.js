import PLAYER from './build/left.player.build.js'

export default class{
    constructor(){
        this.element = document.querySelector('.left')

        this.modules = {
            player: PLAYER
        }

        this.comp = {}

        this.init()
    }


    // init
    init(){
        // this.initProxy()
        this.create()
    }
    initProxy(){
        const self = this
        
        const proxyObj = {
        }

        this.proxy = new Proxy(proxyObj, {
            isAllTrue(obj){
                return Object.keys(obj).every(key => obj[key] === true)
            },
            set(obj, prop, value){
                obj[prop] = value

                if(this.isAllTrue(obj)){
                }
                
                return true
            }
        })
    }


    // create
    create(){
        this.createComponents()
    }
    createComponents(){
        for(const module in this.modules){
            const instance = this.modules[module]

            this.comp[module] = new instance({element: this.element, proxy: this.proxy})
        }
    }


    // animate
    animate(){
        for(const comp in this.comp){
            if(!this.comp[comp].animate) continue
            this.comp[comp].animate()
        }
    }


    // get
    get(name){
        return this.comp[name].get()
    }
}