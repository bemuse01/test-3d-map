import * as THREE from '../../lib/three.module.js'
import PARAM from './param/map.param.js'
import PUBLIC_METHOD from '../../method/method.js'

import CHILD from './build/map.child.build.js'
import MIRROR from './build/map.mirror.build.js'
import EPICENTER from './build/map.epicenter.build.js'
import RADAR from './build/map.radar.build.js'
import CONNECTION from './build/map.connection.build.js'
import GRID from './build/map.grid.build.js'
import TARGET from './build/map.target.build.js'

import JP from '../../data/jp_points.min.js'
import KR from '../../data/kr_points.min.js'
import US from '../../data/us_points.min.js'
import CN from '../../data/cn_points.min.js'
import UK from '../../data/uk_points.min.js'
import RU from '../../data/ru_points.min.js'

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
            connection: CONNECTION,
            grid: GRID,
            target: TARGET
        }
        this.group = {}
        this.comp = {}
        this.build = new THREE.Group()

        this.map = {
            jp: JP,
            kr: KR,
            us: US,
            cn: CN,
            uk: UK,
            ru: RU,
        }
        this.mapIndex = 0

        this.play = true

        this.timer = 10000
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
        
        const proxyObj = {
            play: false,
            child: false,
            epicenter: false,
            connection: false,
            // target: false
        }

        this.proxy = new Proxy(proxyObj, {
            isAllTrue(obj){
                return Object.keys(obj).every(key => obj[key] === true)
            },
            set(obj, prop, value){
                obj[prop] = value

                // when open close, play map
                if(prop === 'play' && obj['play'] === true){
                    self.updateTimes()
                    self.executeChild()
                }

                // start tweens after child tween done
                if(prop === 'child' && obj['child'] === true){
                    self.play = true
                    self.executeTween()
                }

                // disappear current map and display new map
                if(this.isAllTrue(obj)){
                    self.setProxyToFalse()
                    self.setMap()
                    self.executeClose()
                }
                
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

            this.comp[module] = new instance({group, size: this.size, map: this.map[Object.keys(this.map)[0]], parent: this, proxy: this.proxy, camera: this.camera})
        }
    }


    // interval
    intervalStopTween(){
        // interval after open close
        if(!this.play){
            this.oldTime = window.performance.now()
            return
        }

        this.currentTime = window.performance.now()
        if(this.currentTime - this.oldTime > this.timer){
            this.oldTime = this.currentTime
            this.play = false
        }
    }


    // execute
    executeChild(){
        this.comp.child.open(this.group.child)
    }
    executeTween(){
        this.comp.epicenter.initTween()
        this.comp.connection.initTween()
        this.comp.target.initTween()
    }
    executeClose(){
        for(const comp in this.comp){
            if(!this.comp[comp].close) continue
            this.comp[comp].close(this.group[comp])
        }
    }
    updateTimes(){
        this.oldTime = window.performance.now()
        this.currentTime = window.performance.now()
    }


    // set
    setMap(){
        const keys = Object.keys(this.map)
        this.mapIndex = (this.mapIndex + 1) % keys.length

        for(const comp in this.comp){
            if(!this.comp[comp].setMap) continue
            this.comp[comp].setMap(this.map[keys[this.mapIndex]])
        }
    }
    setProxyToFalse(){
        for(const proxy in this.proxy){
            if(proxy === 'play') continue
            this.proxy[proxy] = false
        }
    }


    // animate
    animate({app}){
        this.render(app)
        this.animateObject()
        this.rotationGroup()
        this.intervalStopTween()
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
            this.comp[i].animate({camera: this.camera})
        }
    }
    rotationGroup(){
        for(const group in this.group){
            // if(group === 'grid') continue
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