import { Request, Response } from "express";
import { User, Story, Contributor, CollabAction, StoryUpdate, StoryDelete, StoryEdit, StoryId } from "../../shared/src/Types";

import stories from '../models/stories'
import contributors from '../models/contributors'


const storiesController = {

    create: async (req: Request, res: Response) => {
        const {creator, title, content} = req.body as StoryUpdate

        const story = await stories.create(title, content)
        const contributor = await contributors.add(creator, story.id)

        res.status(200).json({story, contributor})
    },

    edit: async (req: Request, res: Response) => {
        const {actorId, story} = req.body as StoryEdit

        const contributor = await contributors.get(actorId, story.id)
        if(!contributor){
            res.sendStatus(403)
            return
        }

        const upd = await stories.edit(story)

        res.status(200).json(upd)
    },

    remove: async (req: Request, res: Response) => {
        const {storyId, actorId} = req.body as StoryDelete

        const contributor = await contributors.get(actorId, storyId)
        if(!contributor){
            res.sendStatus(403)
            return
        }

        const id = await stories.remove(storyId) as StoryId

        res.status(200).json({storyId}) 
    },

    // addCollaborator: async (req: Request, res: Response) => {
    //     const {actorId, userId, storyId} = req.body as CollabAction
        
    //     const userWithRight = await contributors.get(actorId, storyId)
    //     if(!userWithRight){
    //         res.sendStatus(403)
    //         return
    //     }

    //     const alreadyContr = await contributors.get(userId, storyId)
    //     if(alreadyContr){
    //         res.sendStatus(403)
    //         return
    //     }

    //     const contributor = await contributors.add(userId, storyId)
    //     res.status(200).json(contributor)
    // },
    // removeCollaborator: async (req: Request, res: Response) => {
    //     const {actorId, userId, storyId} = req.body as CollabAction

    //     const userWithRight = await contributors.get(actorId, userId)
    //     if(!userWithRight){
    //         res.sendStatus(403)
    //         return
    //     }

    //     const otherContr = await contributors.get(userId, storyId)
    //     if(!otherContr){
    //         res.sendStatus(403)
    //         return
    //     }

    //     const contrId = await contributors.removeById(userId)
    //     res.status(200).json({userId: contrId})
    // }

}

export default storiesController