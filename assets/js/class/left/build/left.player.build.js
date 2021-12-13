// import METHOD from '../method/left.player.method.js'

class LeftPlayerBuild{
    constructor({musics}){
        this.musics = musics
        this.el = []
        this.style = {opacity: '0', animation: 'none'}

        this.crtMusicIdx = 0
        this.audio = new Audio()
        this.audio.loop = false
        this.audio.volume = 0.6
        this.currentTime = 0
        this.currentIdx = null
        this.isAudioPlaying = false
        this.isLoop = false
        this.lastTime = 0
        this.audioData = null
        this.fft = 2 ** 14

        this.playAudioListener = () => {
            this.audio.play()
            this.isAudioPlaying = !this.audio.paused
        }

        this.endAudioListener = () => {
            this.moveToNext()
        }

        this.init()
    }


    // init
    init(){
        this.create()
        this.createContext()
        this.timeUpdate()

        this.audio.addEventListener('ended', this.endAudioListener)
    }


    // open
    open(){
        this.style.animation = `blank 0.05s 3 ${Math.random()}s linear forwards`
    }


    // create
    create(){
        this.el = this.musics.map(({path, title, duration}, i) => ({
            key: i,
            src: path,
            title: title,
            duration: LeftPlayerMethod.processMusicDuration(duration),
            isPlaying: false,
            style: {
                
            }
        }))
    }
    createContext(){
        this.context = new AudioContext()
        
        const source = this.context.createMediaElementSource(this.audio)
        
        this.analyser = this.context.createAnalyser()
        source.connect(this.analyser)
        this.analyser.connect(this.context.destination)
        this.analyser.fftSize = this.fft
        // this.analyser.smoothingTimeConstant = PARAM.smoothingTimeConstant
        
        const bufferLength = this.analyser.frequencyBinCount
        
        this.audioData = new Uint8Array(bufferLength)
    }


    // event
    playByButton(){
        if(this.audio.paused){
            if(this.currentIdx === null) this.play(0, false)
            else this.play(undefined, false)
        }
        else this.pause()
    }
    // play audio
    play(idx, selected){
        if(idx !== undefined) this.currentIdx = idx

        this.el.forEach((e, i) => {
            if(i === this.currentIdx){
                e.isPlaying = true

                e.style.opacity = '1'
                e.style.background = '#32eaff22'

                this.playMusic(this.el[this.currentIdx].src, selected)
            }else{
                e.isPlaying = false

                e.style = {}
            }
        })
    }
    playMusic(src, selected){
        this.audio.src = src

        this.audio.addEventListener('canplaythrough', this.playAudioListener)

        if(selected) this.audio.currentTime = 0
        else this.audio.currentTime = this.lastTime
    }
    // stop audio
    stop(){
        this.audio.pause()
        this.audio.currentTime = 0
        this.currentTime = 0
        this.audio.removeEventListener('canplaythrough', this.playAudioListener)
        this.lastTime = 0
        this.isAudioPlaying = !this.audio.paused
    }
    // pause audio
    pause(){
        this.audio.pause()
        this.lastTime = this.audio.currentTime
        this.isAudioPlaying = !this.audio.paused
    }
    // loop
    toggleAudioLoop(){
        if(this.audio.loop) this.removeAudioLoop()
        else this.setAudioLoop()
    }
    removeAudioLoop(){
        this.audio.loop = false
        this.isLoop = false
        this.audio.addEventListener('ended', this.endAudioListener)
    }
    setAudioLoop(){
        this.audio.loop = true
        this.isLoop = true
        this.audio.removeEventListener('ended', this.endAudioListener)
    }
    getAudioLoop(){
        return this.isLoop
    }
    // current music
    currentMusic(){
        if(!this.currentIdx && this.currentIdx !== 0) return null
        return this.el[this.currentIdx]
    }
    // current audio time
    timeUpdate(){
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime
        })
    }
    currentAudioTime(){
        return this.currentTime
    }
    currentAudioDuration(){
        return this.audio.duration
    }
    // get audio is playing
    isPlaying(){
        return this.isAudioPlaying
    }
    // move to prev song
    moveToPrev(){
        if(this.currentIdx === null) this.currentIdx = 0

        if(this.currentIdx === 0) this.currentIdx = this.el.length - 1
        else this.currentIdx--

        this.play(this.currentIdx, true)
    }
    // move to next song
    moveToNext(){
        if(this.currentIdx === null) this.currentIdx = 0

        this.currentIdx = (this.currentIdx + 1) % this.el.length

        this.play(this.currentIdx, true)
    }
    // set volume
    setVolume(volume){
        this.audio.volume = volume / 100
    }


    // get
    get(){
        return this.el
    }


    // animate
    animate(){
        if(!this.analyser) return

        this.analyser.getByteFrequencyData(this.audioData)
    }
}