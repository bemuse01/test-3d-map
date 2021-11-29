export default class{
    constructor(){
        this.texts = [
            'Intializing system...',
            'Optimizing system...',
            'Synchronizing targets...',
            'Loading maps...',
            'accessing data...',
            'Waiting...',
            'Complete.',
        ]

        this.init()
    }


    // init
    init(){
    }


    // create
    create(){
        return this.texts.map((text, i) => ({
            key: i,
            text,
            style: {

            }
        }))
    }
}