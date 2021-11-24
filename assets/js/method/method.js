export default {
    normalize(x, a, b, min, max){
        return (b - a) * (x - min) / (max - min) + a 
    },
    getVisibleHeight(camera, depth){
        const cameraOffset = camera.position.z
        if(depth < cameraOffset) depth -= cameraOffset
        else depth += cameraOffset
        const vFov = camera.fov * RADIAN
        return 2 * Math.tan(vFov / 2) * Math.abs(depth)
    },
    getVisibleWidth(camera, depth){
        const height = this.getVisibleHeight(camera, depth)
        return height * camera.aspect
    },
    clamp(x, min, max){
        return x <= min ? min : x >= max ? max : x
    },
    shuffle(arr){
        const temp = [...arr]
        for (let i = temp.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1))
            const t = temp[i]
            temp[i] = temp[j]
            temp[j] = t
        }
        return temp
    },
    median(arr){
        const temp = [...arr].sort()
        const mid = Math.ceil(temp.length / 2)
        const median = temp.length % 2 === 0 ? (temp[mid] + temp[mid - 1]) / 2 : temp[mid - 1]
        return median
    },
    getSphereCoord(lat, lon, radius) {
        const phi = (90 - lat) * RADIAN
        const theta = (180 - lon) * RADIAN
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)
        return {x, y, z}
    },
    getSphereCoord2(lat, lon, radius) {
        const phi = lat * RADIAN
        const theta = lon * RADIAN
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)
        return {x, y, z}
    },
    getCrossLineTheta(v1 = {x, y}, v2 = {x, y}){
        const sign = Math.sign(v1.y)
        const out = v1.x * v2.x + v1.y * v2.y
        const dot = Math.sqrt(v1.x ** 2 + v1.y ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2)
        const theta = Math.acos(out / dot) * sign
        return theta
    },
    linearInterpolate(x1, x2, x){
        const d1 = x2 - x1
        const d2 = x - x1
        return d2 / d1
    }
}