import {Socket, } from 'socket.io'
import jwt from 'jsonwebtoken'
import { AuthPayload } from '../../shared/src/Types'

export function verifyToken(socket: Socket, next: () => {}) {

    if(socket.handshake.query && socket.handshake.query.token){
        const token = socket.handshake.query.token as string

        const decoded: AuthPayload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload

        console.log(decoded)

        if(!decoded){
            socket.on('disconnect', () => {})
        }

        next()
    }

}