import {Server} from 'socket.io'
import { createServer } from 'node:http'
import app from './app'
import { 
    Comment, 
    CommentEditRequest, 
    CommentPostRequest, 
    CommentRemoveRequest,
    CommentEdited,
    CommentPosted,
    CommentRemoved,
    AuthPayload,
} from '../shared/src/Types'
import comments from './controllers/comments'
import { verifyToken } from './middlewares/socketAuth'

export const httpServer = createServer(app)
const io = new Server(httpServer)

io.use(verifyToken)

io.on('connection', (socket) => {

    socket.on('comment_post', async (req: CommentPostRequest) => {
        const res = await comments.create(socket.data, req)
        io.emit('comment_posted', res)
    }) 

    socket.on('comment_edit', async (req: CommentEditRequest) => {
        const res = await comments.edit(socket.data, req)
        io.emit('comment_edited', res)
    })

    socket.on('comment_remove', async (req: CommentRemoveRequest) => {
        const res = await comments.remove(socket.data, req)
        io.emit('comment_removed', res)
    })

})

export default io