import { 
    AuthPayload, 
    CommentEditRequest, 
    CommentEdited, 
    CommentPostRequest, 
    CommentPosted, 
    CommentRemoveRequest, 
    CommentRemoved } from "../../shared/src/Types"
import comments from '../models/comments'

const commentsController = {

    create: async (data: AuthPayload, req: CommentPostRequest): Promise<CommentPosted> => {
        const comment = await comments.create(req.storyId, data.id, req.content)
        return {posted: comment}
    },

    edit: async(data: AuthPayload, req: CommentEditRequest): Promise<CommentEdited> => {
        const updated = await comments.edit(req.id, req.content)
        return {edited: updated}
    },

    remove: async(data: AuthPayload, req: CommentRemoveRequest): Promise<CommentRemoved> => {
        const comment = await comments.delete(req.id)
        return {id: comment.id}
    }

}

export default commentsController