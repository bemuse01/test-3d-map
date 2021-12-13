class Open{
    constructor({map, left, right}){
        this.parentElement = document.querySelector('.open')
        this.element = document.querySelector('.open-element-container')

        this.modules = {
            text: OpenTextBuild,
        }

        this.comp = {}

        this.isOpenDone = false

        this.mapProxy = map.proxy
        this.leftProxy = left.proxy
        this.rightProxy = right.proxy

        this.init()
    }


    // init
    init(){
        this.initProxy()
        this.create()

        this.element.addEventListener('transitionend', () => this.onTransitionend())
    }
    initProxy(){
        const self = this
        
        const proxyObj = {
            text: false
        }

        this.proxy = new Proxy(proxyObj, {
            isAllTrue(obj){
                return Object.keys(obj).filter(key => key !== 'element').every(key => obj[key] === true)
            },
            set(obj, prop, value){
                obj[prop] = value

                // when open's comps all true, close open and show map
                if(this.isAllTrue(obj)){
                    self.element.style.opacity = 0
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


    // event
    onTransitionend(){
        this.mapProxy.play = true
        this.leftProxy.play = true
        this.rightProxy.play = true
        this.parentElement.style.display = 'none'
        this.element.style.display = 'none'
    }


    // get
    get(name){
        return this.comp[name].get()
    }
}