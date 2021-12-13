// import STATUS from './build/right.status.js'
// import DATE from './build/right.date.js'

class Right{
    constructor({}){
        this.element = document.querySelector('.right')

        this.modules = {
            status: {name: RightStatusBuild},
            date: {name: RightDateBuild}
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


    // get
    get(name){
        return this.comp[name].get()
    }
    getComp(name){
        return this.comp[name]
    }
}