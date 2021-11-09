export default {
    getCenterPoint(p1, p2){
        const xdist = Math.abs(p1.rx - p2.rx) / 2
        const ydist = Math.abs(p1.ry - p2.ry) / 2
        const rx = Math.max(p1.rx, p2.rx) - xdist
        const ry = Math.max(p1.ry, p2.ry) - ydist
        return {rx, ry, rdist: xdist}
    },
    createPosition(seg){
        const position = []

        for(let i = 0; i < seg; i++){
            
        }
    }
}