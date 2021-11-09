import * as THREE from '../../lib/three.module.js'

export default class{
    constructor(){
        this.wrap = document.getElementById('wrap')

        const {width, height} = this.wrap.getBoundingClientRect()
        this.width = width
        this.height = height
        
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const canvas = document.querySelector('#canvas')

        this.scene = new THREE.Scene()
    
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: canvas})
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(RATIO)
        this.renderer.setClearColor(0x000000, 0.0)
        this.renderer.setClearAlpha(0.0)
        this.renderer.autoClear = false
    }


    // render
    animate(){
        this.render()
    }
    render(){
        this.renderer.setScissorTest(false)
        this.renderer.clear(true, true)
        this.renderer.setScissorTest(true)
    }


    // resize
    resize(){
        const {width, height} = this.wrap.getBoundingClientRect()

        this.width = width
        this.height = height

        this.renderer.setSize(this.width, this.height)
    }
}