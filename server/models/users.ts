import {knex, Knex} from 'knex'
import db from '../config/db'
import { User, UserId, Password} from '../../shared/src/Types'

export interface UsersModel {
    create: (username: string, email: string,  hashed: string) => Promise<User>
    remove: (id: UserId) => Promise<UserId>
    updatePassword: (id: UserId, newPassword: string) => Promise<void>

    getAll: () => Promise<User[]>
    getById: (id: UserId) => Promise<User>
    getByUsername: (username: string) => Promise<User>

    findByUsername: (username: string) => Promise<User[]>
}

const model: UsersModel = {
    async create(username, email, hashed){
        const [newUser] = await db('users')
            .insert(
                {username, email, hashed}, 
                ['id', 'username', 'hashed', 'email']) as User[]
        return newUser
    },
    async remove(userId){
        const [{id}]: Partial<User>[]  = await db('users')
            .where('id', userId)
            .del(['id'])
        return id as UserId
    },
    async updatePassword(id, newPassword) {
        await db('users')
            .where('id', id)
            .update({hashed: newPassword})
    },

    async getAll() {
        return await db('users')
            .orderBy("username")
            .select('id', 'username', 'email', 'hashed')
    },
    async getById(id) {
        const [user]: User[] = await db('users')
            .where("id", id)
        return user;
    },
    async getByUsername(username) {
        const user = await db('users')
            .where('username', username)
            .select('id', 'username', 'hashed', 'email')
            .first() as User
        return user;
    },
    async findByUsername(username) {
        const result = await db('users')
            .whereRaw('LOWER(username) LIKE LOWER(?)', [`%${username}%`])
            .select('id', 'username', 'hashed') as User[]
        return result
    },
}

export default model
