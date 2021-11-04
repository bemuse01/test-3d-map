import APP from '../application/app/app.build.js'
import AUDIO from '../application/audio/audio.build.js'
import VISUALIZER from '../application/visualizer/visualizer.build.js'
import PROGRESS from '../application/progress/progress.build.js'

new Vue({
    el: '#wrap',
    data(){
        return{
            element: {
                progress: new PROGRESS()
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
            OBJECT.app = new APP()

            this.createObject()
        },
        resizeThree(){
            const {app} = OBJECT

            for(let i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize({app})
            }
        },
        renderThree(){
            const {app, audio} = OBJECT
            
            for(let i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate({app, audio})
            }
        },
        createObject(){
            this.createAudio()
            this.createVisualizer()
        },
        createAudio(){
            OBJECT.audio = new AUDIO()
        },
        createVisualizer(){
            OBJECT.visualizer = new VISUALIZER(OBJECT)
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
            this.element.progress.group.child.onClick(e, audio)
        },


        // event
        onWindowResize(){
            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
        },
        animate(){
            this.render()
            this.animateElement()
            requestAnimationFrame(this.animate)
        }
    }
})