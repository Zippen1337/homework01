import express, {Request, Response} from 'express';

export const app = express()

app.use(express.json())

const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

type RequestWithParams<p> = Request<p,{},{},{}>
type RequestWithBody<b> = Request<{},{},b,{}>
type RequestWithBodyAndParams<b,p> = Request<p,{},b,{}>
type Params = {
    id: string
}
type CreateVideoDto = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
type UpdateVideoDto = {
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

type ErrorType = {
    errorsMessages: ErrorMessageType[]
}
type ErrorMessageType = {
    message: string
    field: string
}

const videos: VideoType[] = [
    {
        id: 1,
        title: "Title1",
        author: "Author1",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-11-07T18:49:23.113Z",
        publicationDate: "2023-11-07T18:49:23.113Z",
        availableResolutions: [
            "P144"
        ]
    },
    {
        id: 2,
        title: "Title2",
        author: "Author2",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2023-11-07T18:49:23.113Z",
        publicationDate: "2023-11-07T18:49:23.113Z",
        availableResolutions: [
            "P144"
        ]
    }
]

app.get('/videos', (req: Request, res:Response) => {
    res.send(videos)
})

app.get('/videos/:id', (req: RequestWithParams<Params>, res:Response) => {
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)
        if (!video) {
            res.sendStatus(404)
            return
        }
        res.send(video)
})

app.post('/videos', (req: RequestWithBody<CreateVideoDto>,res:Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body

    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid title', field: 'title'})
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author', field: 'author'})
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message: 'Invalid availableResolutions', field: 'availableResolutions'})
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.put('/videos/:id',(req:RequestWithBodyAndParams<UpdateVideoDto, Params>,res:Response) => {
    const id = +req.params.id
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid title', field: 'title'})
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid title', field: 'author'})
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message: 'Invalid availableResolutions', field: 'availableResolutions'})
        })
    } else {
        availableResolutions = []
    }
    if (typeof canBeDownloaded === "undefined"){
        canBeDownloaded = false
    }
    if (typeof canBeDownloaded !== "boolean"){
        errors.errorsMessages.push({message: 'Invalid canBeDownloaded',field: 'canBeDownloaded'})
    }
    if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction === "number"){
        minAgeRestriction < 1 || minAgeRestriction > 18 && errors.errorsMessages.push({message: 'Invalid minAgeRestriction',field: 'minAgeRestriction'})
    } else {
        minAgeRestriction = null
    }

    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const videoIndex = videos.findIndex(v => v.id === id)
    const video = videos.find(v => v.id === id)

    if (!video){
        res.sendStatus(404)
        return
    }

    const updatedItem = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions,
        publicationDate: publicationDate ? publicationDate : video.publicationDate
    }

    videos.splice(videoIndex,1,updatedItem)
    res.sendStatus(204)
})

app.delete('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    const videoIndex = videos.findIndex(v => v.id === id)
    const video = videos.find(v => v.id === id)
    if (!video){
        res.sendStatus(404)
        return
    }
    videos.splice(videoIndex,1)
    res.sendStatus(204)
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.splice(0,videos.length)
    res.sendStatus(204)
})

// дописать delete, delete by id, сделать тесты, развернуть на версель и пройти проверку д/з