const LeftPlayerMethod = {
    processMusicDuration(duration){
        const min = this.addZero(~~(duration / 60) + '')
        const sec = this.addZero(~~(duration % 60) + '')
        return `${min}:${sec}`
    },
    addZero(time){
        return ('' + time).length < 2 ? '0' + time : '' + time
    }
}