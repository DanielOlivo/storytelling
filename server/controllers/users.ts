import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import {Credentials, LoginCredentials, LoginResponse, User} from '../../shared/src/Types'
import { hash, compare } from 'bcrypt'
import users from '../models/users'


const userController = {
    register: async (req: Request, res: Response) => {
        const credentials = req.body as Credentials

        const existing = await users.getByUsername(credentials.username!)
        if(existing){
            res.status(400).json({message: 'user already exists'})            
            return
        } 

        const saltRouds = 10 
        const hashed = await hash(credentials.password!, saltRouds)

        const newUser = await users.create(
            credentials.username!,
            credentials.email!,
            hashed
        )

        const {hashed: h, ...resObj} : User = newUser
        
        res.status(200).json(resObj)
    },

    login: async (req: Request, res: Response) => {
        const {username, password} = req.body as LoginCredentials

        const existing = await users.getByUsername(username)

        if(!existing){
            res.status(400).json({message: 'username or password not matching'})            
            return
        }

        const matched = await compare(password, existing.hashed)

        if(!matched){
            res.status(400).json({message: 'username or password not matching'})            
            return
        }

        const accessToken = jwt.sign(
            {id: existing.id, username: existing.username, email: existing.email},
            process.env.JWT_SECRET as string,
            {expiresIn: '7d'}
        )

        res.cookie('token', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        })

        const responsePayload = {
            message: 'success',
            user: {id: existing.id, username: existing.username, email: existing.email},
            token: accessToken
        } as LoginResponse

        res.status(200).json(responsePayload)
    }
}

export default userController

