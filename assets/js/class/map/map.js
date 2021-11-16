import * as THREE from '../../lib/three.module.js'
import PARAM from './param/map.param.js'
import PUBLIC_METHOD from '../../method/method.js'
import CHILD from './build/map.child.build.js'
import MIRROR from './build/map.mirror.build.js'
import EPICENTER from './build/map.epicenter.build.js'
import RADAR from './build/map.radar.build.js'
import CONNECTION from './build/map.connection.build.js'
import JP from '../../data/jp_points.js'
import KR from '../../data/kr_points.js'

export default class{
    constructor(){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 1000
        }

        this.modules = {
            mirror: MIRROR,
            child: CHILD,
            epicenter: EPICENTER,
            radar: RADAR,
            connection: CONNECTION
        }
        this.group = {}
        this.comp = {}
        this.build = new THREE.Group()

        this.map = {
            jp: JP,
            kr: KR
        }

        this.play = true

        this.timer = 1000
        this.currentTime = window.performance.now()
        this.oldTime = window.performance.now()
        this.playInterval = true

        this.init()
    }


    // init
    init(){
        this.initGroup()
        this.initRenderObject()
        this.initProxy()
        this.create()
        this.add()
    }
    initGroup(){
        for(const module in this.modules){
            this.group[module] = new THREE.Group()
            this.comp[module] = null
        }
    }
    initRenderObject(){
        this.element = document.querySelector('.map-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        const ambient = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambient)

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
                h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
            }
        }
    }
    initProxy(){
        const self = this
        
        const isTweenPlay = {
            child: false,
            epicenter: false,
            connection: false
        }

        this.proxy = new Proxy(isTweenPlay, {
            isAllTrue(obj){
                const arr = []

                for(const prop in obj){
                    if(prop === 'child') continue
                    arr.push(obj[prop])
                }

                return arr.every(e => e === true)
            },
            set(obj, prop, value){
                obj[prop] = value

                // if(this.isAllTrue(obj)) console.log('all true')
                // else console.log('not all true')

                if(obj['child'] === true) self.executeEffect()
                
                return true
            }
        })
    }


    // add
    add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    create(){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            group.rotation.x = PARAM.rotation * RADIAN

            this.comp[module] = new instance({group, size: this.size, map: this.map.jp, parent: this, proxy: this.proxy})
        }
    }


    // interval
    stopTweens(){
        if(!this.play){
            this.oldTime = window.performance.now()
            return
        }

        this.currentTime = window.performance.now()
        if(this.currentTime - this.oldTime > this.timer){
            this.oldTime = this.currentTime
            this.play = false
            console.log('work')
        }
    }


    // execute
    executeEffect(){
        this.comp.epicenter.initTween()
        this.comp.connection.initTween()
    }


    // animate
    animate({app}){
        this.render(app)
        this.animateObject()
        this.rotationGroup()
        // this.stopTweens()
    }
    render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        // app.renderer.clear()

        app.renderer.setScissor(left, bottom, width, height)
        app.renderer.setViewport(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        app.renderer.render(this.scene, this.camera)
    }
    animateObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate()
        }
    }
    rotationGroup(){
        for(const group in this.group){
            this.group[group].rotation.z += 0.002
        }
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
                h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
            }
        }

        this.resizeObject()
    }
    resizeObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize(this.size)
        }
    }
}