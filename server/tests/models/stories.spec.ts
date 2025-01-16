process.env.NODE_ENV = 'test'

import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'
import { User, UserId, Story, StoryId } from '../../../shared/src/Types'
import db from '../../config/db'
import users from '../../models/users'
import stories from '../../models/stories'

describe('stories model', () => {

    let firstStoryId: StoryId, secondStoryId : StoryId;

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()
    })

    afterAll(async () => {
        await db.migrate.rollback()
    })

    test('no stories', async() => {
        const all = await stories.getAll()
        expect(all.length).toEqual(0)
    })

    test('first story', async () => {
        const first = await stories.create('title1', 'content1')
        expect(first.id).toBeDefined()
        expect(first.created).toBeDefined()
        expect(first.title).toEqual('title1')
        expect(first.content).toEqual('content1')

        firstStoryId = first.id
    })

    test('total: 1', async() => {
        const all = await stories.getAll()
        expect(all.length).toEqual(1)
    })

    test('second story', async () => {
        const second = await stories.create('title2', 'content2')
        expect(second.id).toBeDefined()
        expect(second.created).toBeDefined()
        expect(second.title).toEqual('title2')
        expect(second.content).toEqual('content2')

        secondStoryId = second.id
    })

    test('total: 2', async() => {
        const all = await stories.getAll()
        expect(all.length).toEqual(2)
    })

    test('getById: first story', async() => {
        const first = await stories.getById(firstStoryId)
        expect(first.created).toBeDefined()
        expect(first.title).toEqual('title1')
        expect(first.content).toEqual('content1')
    })

    test('getById: second story', async() => {
        const second = await stories.getById(secondStoryId)
        expect(second.created).toBeDefined()
        expect(second.title).toEqual('title2')
        expect(second.content).toEqual('content2')
    })

    test('first story update', async() => {
        const first = await stories.getById(firstStoryId)      
        first.title = 'my first story'
        const upd = await stories.edit(first)
        expect(upd.title).toEqual('my first story')
        expect(upd.content).toEqual('content1')
    })    

    test('remove: second story', async() => {
        const id = await stories.remove(secondStoryId)
        expect(id).toEqual(secondStoryId)
    })

    test("total: 1", async() => {
        const all = await stories.getAll()
        expect(all.length).toEqual(1)
    })
})