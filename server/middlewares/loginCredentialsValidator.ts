import {Request, Response, NextFunction} from 'express'
import { LoginCredentials } from '../../shared/src/Types'

export function validateLoginCredentials(req: Request, res: Response, next: NextFunction) {
    const {username, password} = req.body as LoginCredentials

    if(!username || username.length < 3){
        res.status(400).json({error: 'invalid username'})
        return
    }

    if(!password || password.length < 4){
        res.status(400).json({error: 'invalid password'})
        return
    }

    next()
}