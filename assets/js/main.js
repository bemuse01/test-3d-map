import APP from './class/app/app.js'
import MAP from './class/map/map.js'
import OPEN from './class/open/open.js'

new Vue({
    el: '#wrap',
    data(){
        return{
            modules: {
                app: APP,
                map: MAP,
                open: OPEN
            }
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            for(const module in this.modules){
                const instance = this.modules[module]
                
                OBJECT[module] = new instance(OBJECT)
            }
        },
        resizeThree(){
            for(let i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize(OBJECT)
            }
        },
        renderThree(){
            for(let i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate(OBJECT)
            }
        },


        // element
        animateElement(){
            for(let i in this.element){
                if(!this.element[i].animate) continue
                this.element[i].animate(OBJECT)
            }
        },
        onClickProgress(e){
            const {audio} = OBJECT
            this.element.progress.group.hover.onClick(e, audio)
        },


        // event
        onWindowResize(){
            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
            TWEEN.update()
        },
        animate(){
            this.render()
            this.animateElement()
            requestAnimationFrame(this.animate)
        }
    }
})