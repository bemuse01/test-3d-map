export default {
    getMusicTitle(music){
        return music.split('/').pop()
    },
    getMusicDuration(audio, musicSrc){
        audio.src = musicSrc
        const min = audio.duration / 60
        const sec = audio.duration % 60
        return `${min}:${sec}`
    }
}