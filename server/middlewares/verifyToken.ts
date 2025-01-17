import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { AuthPayload } from '../../shared/src/Types'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if(!token){
        res.status(401).json({message: 'unauthorized'})
        return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as AuthPayload

    if(!decoded){
        res.status(403).json({message: 'forbidden'})
        return
    }

    req.user = decoded // id, username, email, iat, exp

    next()
}

export default verifyToken