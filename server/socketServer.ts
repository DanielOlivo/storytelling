import {Server} from 'socket.io'
import { createServer } from 'http'
import app from './app'

const httpServer = createServer(app)
const io = new Server(httpServer)

io.on('connection', (socket) => {

})

httpServer.listen(process.env.PORT || 3000)

