import db from '../config/db'
import { User, UserId, Password, Story, StoryId} from '../../shared/src/Types'

export interface StoriesModel {
    create: (title: string, content: string) => Promise<Story>
    remove: (id: StoryId) => Promise<StoryId>

    edit: (upd: Story) => Promise<Story>
    editTitleContent: (storyId: StoryId, title: string, content: string) => Promise<Story>

    getAll: () => Promise<Story[]>
    getById: (id: StoryId) => Promise<Story>

    getByUserId: (id: UserId) => Promise<Story[]>

    searchByTitle: (title: string) => Promise<Story[]>
}

const model: StoriesModel = {
    async create(title, content) {
        const [story] = await db('stories')
            .insert({title, content}, ['id', 'title', 'content', 'created', 'updated']) as Story[]
        return story
    },
    async remove(storyId) {
        const [{id}] = await db('stories')
            .where('id', storyId).del(['id']) as Partial<Story>[] 
        return id as StoryId;
    },
    async edit(upd) {
        const [updated] = await db('stories').where('id', upd.id).update({
            title: upd.title,
            content: upd.content
        }, ['id', 'title', 'content', 'created', 'updated']) as Story[]
        return updated
    },
    async editTitleContent(id, title, content) {
        const [updated] = await db('stories').where('id', id).update({
            title: title,
            content: content
        }, ['id', 'title', 'content', 'created', 'updated']) as Story[]
        return updated
    },
    async getAll(){
        const stories = await db('stories')
            .select('id', 'title', 'content', 'created', 'updated') as Story[]
        return stories;
    },
    async getById(id) {
        const story = await db('stories')
            .where('id', id)
            .select('id', 'title', 'content', 'created', 'updated')
            .first() as Story
        return story
    },
    async getByUserId(id) {
        const result = await db('contributors')
            .join('stories', 'contributors.storyId', '=', 'stories.id')
            .where('userId', id)
            .select('stories.id', 'title', 'content', 'stories.created', 'stories.updated') as Story[]
        return result
    },
    async searchByTitle(title) {
        const result = await db('stories')
            .whereRaw("LOWER(title) LIKE LOWER(\'%??%\')", [title]) 
            .select('id', 'title', 'content', 'created', 'updated') as Story[]
        return result
    },
}

export default model