import {Request, Response} from 'express'
import {User} from '../../shared/src/Types'
import { hash, compare } from 'bcrypt'
import users from '../models/users'

export interface UserController {

}

const userController = {
    register: async (req: Request, res: Response) => {
        const credentials = req.body as Partial<User> 

        const existing = await users.getByUsername(credentials.username!)
        if(existing){
            res.status(400).json({message: 'user already exists'})            
            return
        } 

        const saltRouds = 10 
        const hashed = await hash(credentials.hashed!, saltRouds)

        const newUser = await users.create(
            credentials.username!,
            credentials.email!,
            hashed
        )

        // hashed remained only on server
        const {hashed: h, ...resObj} : User = newUser
        
        res.status(200).json(resObj)
    },

    login: async (req: Request, res: Response) => {
        const {username, password} = req.body

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

        res.sendStatus(200)
    }
}

export default userController

