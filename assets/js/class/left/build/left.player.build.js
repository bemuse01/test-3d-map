import METHOD from '../method/left.player.method.js'

export default class{
    constructor({musicSrcs}){
        this.musicSrcs = musicSrcs || [
            // './assets/songs/Sawano Hiroyuki - CRY.mp3',
            // './assets/songs/Sawano Hiroyuki Feat. Laco - Hands Up to the Sky.mp3',
            // './assets/songs/Sawano Hiroyuki Feat.mizuki - Avid.mp3'
        ]
        this.el = []

        this.crtMusicIdx = 0
        this.audio = new Audio()

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.el = this.musicSrcs.map((musicSrc, i) => ({
            key: i,
            src: musicSrc,
            title: METHOD.getMusicTitle(musicSrc),
            duration: METHOD.getMusicDuration(this.audio, musicSrc),
            isPlaying: false, 
            style: {
                
            }
        }))
    }


    // get
    get(){
        return this.el
    }
}