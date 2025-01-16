import db from '../config/db'
import { UserId, StoryId, Contributor, ContributorId } from '../../shared/src/Types'

export interface ContributorsModel {
    add: (userId: UserId, storyId: StoryId) => Promise<Contributor>
    remove: (userId: UserId, storyId: StoryId) => Promise<ContributorId>
    removeById: (id: ContributorId) => Promise<ContributorId>

    getAll: () => Promise<Contributor[]>
}

const model: ContributorsModel = {
    async add(userId, storyId) {
        const [contributor] = await db('contributors')
            .insert({userId, storyId}, ['id', 'userId', 'storyId']) as Contributor[]
        return contributor;
    },
    async remove(userId, storyId) {
        const [{id}] = await db('contributors')
            .where('userId', userId)
            .andWhere('storyId', storyId)
            .del(['id']) as Partial<Contributor>[]
        return id as ContributorId
    },

    async removeById(contrId) {
        const [{id}] = await db('contributors')
            .where('id', contrId)
            .del(['id']) as Partial<Contributor>[]
        return id as ContributorId
    },

    async getAll() {
        const all = await db('contributors')
            .select('id', 'userId', 'storyId') as Contributor[]
        return all
    },
}

export default model