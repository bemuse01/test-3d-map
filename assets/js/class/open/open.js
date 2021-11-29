import TEXT from './build/open.text.build.js'

export default class{
    constructor({map}){
        this.modules = {
            text: TEXT,
        }

        this.comp = {}

        this.isOpenEnd = false

        this.mapProxy = map.proxy

        this.init()
    }


    // init
    init(){
        this.initElement()
        this.create()
    }
    initElement(){
        this.element = document.querySelector('.open-element-container')
    }


    // create
    create(){
        this.createComponents()
    }
    createComponents(){
        for(const module in this.modules){
            const instance = this.modules[module]

            this.comp[module] = new instance()
        }
    }
}