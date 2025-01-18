import {ExtendedError, Socket, } from 'socket.io'
import jwt from 'jsonwebtoken'
import { AuthPayload } from '../../shared/src/Types'

export function verifyToken(socket: Socket, next: (err?: ExtendedError) => void) {
    try {
        const token = socket.handshake.auth.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        if(!decoded){
            throw new Error('failed to verify token')
        }
        // console.log('decoded', decoded)
        const {id, username, email} = decoded as AuthPayload

        // socket.user = decoded
        socket.data = decoded

        next()
    }
    catch(error){
        console.error("auth error: ", error)
        next(new Error('auth error'))
    }
}