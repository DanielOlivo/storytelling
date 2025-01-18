import {Server} from 'socket.io'
import { createServer } from 'node:http'
import app from './app'
import { Comment, CommentEditRequest, CommentPostRequest, CommentRemoveRequest } from '../shared/src/Types'

export const httpServer = createServer(app)
const io = new Server(httpServer)

io.on('connection', (socket) => {

    socket.on('comment_post', (req: CommentPostRequest) => {
        console.log('...posting...')

        const res: Comment = {
            id: 1,
            storyId: req.storyId,
            userId: req.userId,
            content: req.content,
            created: new Date()
        }

        io.emit('comment', res)
    }) 

    socket.on('comment_edit', (req: CommentEditRequest) => {

    })

    socket.on('comment_delete', (req: CommentRemoveRequest) => {

    })



    socket.on('msg', () => {
        console.log('triggered msg')
    })
})

// httpServer.listen(process.env.PORT || 3000)

export default io