const LeftTextMethod = {
    sliceText(ot, nt, idx){
        return ot.slice(0, idx) + nt + ot.slice(idx + nt.length, ot.length)
    },
    createIpv6(hex = '0123456789ABCDEF'){
        const len = ~~(Math.random() * 4)
        const rand = Array.from({length: len}, () => '0000').join(':')
        return `${rand}${len === 0 ? '' : ':::'}0000`.replace(/[0]/g, () => hex[~~(Math.random() * hex.length)])
    },
    createUuid(l = undefined, hex = '0123456789abcdef'){
        const len = l ? l : ~~(Math.random() * 4)
        const rand = Array.from({length: len}, () => 'xxxx').join('-')
        return `${rand}${len === 0 ? '' : '-'}xxxxxxxx`.replace(/[x]/g, () => hex[~~(Math.random() * hex.length)])
    },
    createEncode(code = '0123456789' + 'abcdefghijklmnopqrstuvwxyz' + 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()){
        const rand = Array.from({length: ~~(Math.random() * 3)}, () => 'xxxx').join('')
        const eq = Math.random() > 0.5 ? '=' : '=='
        return `${rand}xxxxxx${eq}`.replace(/[x]/g, () => code[~~(Math.random() * code.length)])
    },
    createAuth(type){
        switch(type){
            case 'ip': 
                return this.createIpv6()
            case 'uuid':
                return this.createUuid()
            case 'encode':
                return this.createEncode()
            default:
                return this.createIpv6()
        }
    }
}