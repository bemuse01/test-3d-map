import METHOD from '../method/left.player.method.js'

export default class{
    constructor({musicSrcs}){
        this.musicSrcs = musicSrcs
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
            name: METHOD.getMusicName(musicSrc),
            length: METHOD.getMusicDuration(this.audio, musicSrc),
            style: {

            }
        }))
    }


    // get
    get(){
        return this.el
    }
}