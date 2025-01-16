import {knex} from 'knex'
import db from '../config/db'
import { UserId, StoryId, Comment } from "../../shared/src/Types"

export interface MessagesModel {
    create: (postId: StoryId, sender: UserId, content: string, timestamp?: Date) => Promise<Comment>
    getAll: (postId: StoryId) => Promise<Comment[]>
}

const model: MessagesModel = {
    async create(chatId, userId, content, timestamp?) {
        throw new Error()
    },
    async getAll(chatId) {
        throw new Error()
    },
}

export default model