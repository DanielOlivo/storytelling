import {knex} from 'knex'
import db from '../config/db'
import { UserId, StoryId, Comment, CommentId } from "../../shared/src/Types"

export interface CommentsModel {
    create: (storyId: StoryId, sender: UserId, content: string, timestamp?: Date) => Promise<Comment>
    edit: (commentId: CommentId, content: string) => Promise<Comment>
    delete: (id: CommentId) => Promise<Comment>
    getAll: (storyId: StoryId) => Promise<Comment[]>
}

const model: CommentsModel = {
    async create(storyId, userId, content, timestamp?) {
        const [comment]: Comment[] = await db('comments')
            .insert(
                {userId, storyId, content}, 
                ['id', 'userId', 'storyId', 'content', 'created'])
        return comment
    },
    async edit(commentId, content) {
        const [comment]: Comment[] = await db('comments')
            .where('id', commentId)
            .update({content: content}, ['id', 'userId', 'storyId', 'content', 'created'])
        return comment
    },
    async delete(id) {
        const [comment]: Comment[] = await db('comments')
            .where('id', id)
            .del(['id', 'userId', 'storyId', 'content', 'created'])
        return comment
    },
    async getAll(storyId) {
        const comments = await db('comments')
            .orderBy('created', 'asc')
            .where('storyId', storyId)
            
        return comments
    },
}

export default model