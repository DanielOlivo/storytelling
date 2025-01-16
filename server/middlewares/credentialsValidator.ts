import {Request, Response, NextFunction} from 'express'
import { Credentials } from '../../shared/src/Types'

export function validateCredentials(req: Request, res: Response, next: NextFunction){
    const {username, password, email} = req.body as Credentials

    if(!username || username.length < 3){
        res.status(400).json({error: 'invalid username'})
        return
    }

    if(!password || password.length < 4){
        res.status(400).json({error: 'invalid password'})
        return
    }

    const pattern = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim
    if(!email || !pattern.test(email)){
        res.status(400).json({error: 'invalid email'})
        return
    }

    next()
}
