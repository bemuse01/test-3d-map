// import APP from './class/app/app.js'
// import MAP from './class/map/map.js'
// import OPEN from './class/open/open.js'
// import LEFT from './class/left/left.js'
// import RIGHT from './class/right/right.js'

new Vue({
    el: '#wrap',
    data(){
        return{
            musics: [{path: 'sadf', title: 'asdf', duration: '00:00'}],
            objectModules: {
                app: App,
                map: Map
            },
            elementModules: {
                left: Left,
                right: Right,
                open: Open,
            },
            elements: {
                left: null,
                right: null,
                open: null,
            },
            volume: 60
        }
    },
    mounted(){
        this.init()
    },
    watch: {
        currentVolume(){
            if(!this.elements['left']) return

            this.getComp('left', 'player').setVolume(this.volume)
        }
    },
    computed: {
        getElement(){
            return (name, child) => {
                if(!this.elements[name]) return []
                else return this.elements[name].get(child)
            }
        },
        getStyle(){
            return (name, child) => {
                if(!this.elements[name]) return {}
                else return this.getComp(name, child).style
            }
        },
        currentMusicTitle(){
            if(!this.elements['left']) return 'Current Music'

            const music = this.getComp('left', 'player').currentMusic()

            if(!music) return 'Current Music'
            else return music.title
        },
        currentAudioTime(){
            if(!this.elements['left']) return {transform: 'scaleX(0)'}
            
            const crtTime = this.getComp('left', 'player').currentAudioTime()
            const duration = this.getComp('left', 'player').currentAudioDuration()
            const scaleX = isNaN(duration) ? 0 : crtTime / duration

            return {transform: `scaleX(${scaleX})`}
        },
        togglePlayButtonImage(){
            if(!this.elements['left']) return {backgroundImage: `url('./assets/src/play.png')`}

            const audioState = this.getComp('left', 'player').isPlaying()
            return {backgroundImage: audioState ? `url('./assets/src/pause.png')` : `url('./assets/src/play.png')`}
        },
        currentVolumeBar(){
            if(!this.elements['left']) return {transform: 'scaleX(0)'}
            return {transform: `scaleX(${this.volume / 100})`}
        },
        currentVolume(){
            return this.volume
        },
        toggleTypeButtonImage(){
            if(!this.elements['left']) return {backgroundImage: `url('./assets/src/all.png')`}
            
            const isLoop = this.getComp('left', 'player').getAudioLoop()
            return {backgroundImage: isLoop ? `url('./assets/src/one.png')` : `url('./assets/src/all.png')`}
        },
        currentTime(){
            if(!this.elements['left']) return '00:00:00'
            return this.getComp('left', 'clock').getCurrentTime()
        },
        currentDate(){
            if(!this.elements['right']) return '0000.00.00.Sat'
            return this.getComp('right', 'date').getCurrentDate()
        },
    },
    methods: {
        init(){
            this.initThree()
            this.initElement()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            for(const module in this.objectModules){
                const instance = this.objectModules[module]
                
                OBJECT[module] = new instance(OBJECT)
            }
        },
        resizeThree(){
            for(const i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize(OBJECT)
            }
        },
        renderThree(){
            for(const i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate(OBJECT)
            }
        },


        // element
        addElement(){
            for(const module in this.elementModules){
                this.elements[module] = null
            } 
        },
        initElement(){
            for(const module in this.elementModules){
                const instance = this.elementModules[module]

                this.elements[module] = new instance({...OBJECT, ...this.elements, musics: this.musics})
            }  
        },
        animateElement(){
            for(const i in this.elements){
                if(!this.elements[i].animate) continue
                this.elements[i].animate(OBJECT)
            }
        },
        getComp(name, child){
            return this.elements[name].getComp(child)
        },


        // audio
        playAudio(idx){
            this.getComp('left', 'player').play(idx, true)
        },
        onClickPlayButton(){
            this.getComp('left', 'player').playByButton()
        },
        onClickStopButton(){
            this.getComp('left', 'player').stop()
        },
        onClickPrevButton(){
            this.getComp('left', 'player').moveToPrev()
        },
        onClickNextButton(){
            this.getComp('left', 'player').moveToNext()
        },
        onClickTypeButton(){
            this.getComp('left', 'player').toggleAudioLoop()
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
            // requestAnimationFrame(this.animate)
            requestIdleCallback(this.animate)
        }
    }
})