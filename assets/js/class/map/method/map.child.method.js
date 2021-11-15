import PUBLIC_METHOD from '../../../method/method.js'

export default {
    createIndex(div, len){
        const arr = PUBLIC_METHOD.shuffle(Array.from({length: len}, (_, i) => i))
        const temp = []

        for(let i = 0; i < Math.ceil(len / div); i++){
            const start = i * div
            const end = (i + 1) * div
            temp.push(arr.slice(start, end < len ? end : len))
        }

        return temp
    }
}