import { Request, Response } from "express";
import { User, UserId, Story, Contributor, CollabAction, StoryUpdate, StoryDelete, StoryEdit, StoryId } from "../../shared/src/Types";

import stories from '../models/stories'
import contributors from '../models/contributors'


const storiesController = {

    create: async (req: Request, res: Response) => {
        const {title, content}: StoryUpdate = req.body
        const creator = req.user.id

        const story = await stories.create(title, content)
        const contributor = await contributors.add(creator, story.id)

        res.status(200).json({story, contributor})
    },

    edit: async (req: Request, res: Response) => {
        const {storyId, title, content} = req.body as StoryEdit

        const contributor = await contributors.get(req.user.id, storyId)
        if(!contributor){
            res.sendStatus(403)
            return
        }

        const upd = await stories.editTitleContent(storyId, title, content)

        res.status(200).json(upd)
    },

    remove: async (req: Request, res: Response) => {
        const {storyId}: StoryDelete = req.body

        const contributor = await contributors.get(req.user.id, storyId)
        if(!contributor){
            res.sendStatus(403)
            return
        }

        const id = await stories.remove(storyId) as StoryId

        res.status(200).json({id}) 
    },

    getAll: async (req: Request, res: Response) => {
        const all = await stories.getByUserId(req.user.id)
        res.status(200).json(all)
    }

}

export default storiesController