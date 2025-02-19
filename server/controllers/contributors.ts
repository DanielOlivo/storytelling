import { Request, Response } from "express";

import { CollabAction } from "../../shared/src/Types";
import stories from '../models/stories'
import contributors from '../models/contributors'

const contributorController = {

    addCollaborator: async (req: Request, res: Response) => {
        const {userId, storyId}: CollabAction = req.body
        
        const userWithRight = await contributors.get(req.user.id, storyId)
        if(!userWithRight){
            res.sendStatus(403)
            return
        }

        const alreadyContr = await contributors.get(userId, storyId)
        if(alreadyContr){
            res.sendStatus(403)
            return
        }

        const contributor = await contributors.add(userId, storyId)
        res.status(200).json(contributor)
    },

    removeCollaborator: async (req: Request, res: Response) => {
        const {userId, storyId}: CollabAction = req.body

        const userWithRight = await contributors.get(req.user.id, storyId)
        if(!userWithRight){
            res.sendStatus(403)
            return
        }

        const otherContr = await contributors.get(userId, storyId)
        if(!otherContr){
            res.sendStatus(403)
            return
        }

        const contrId = await contributors.removeById(userId)
        res.status(200).json({userId: contrId})
    }
}

export default contributorController