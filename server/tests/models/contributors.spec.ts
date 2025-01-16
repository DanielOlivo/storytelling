process.env.NODE_ENV = 'test'

import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'
import { User, UserId, Story, StoryId, ContributorId } from '../../../shared/src/Types'
import db from '../../config/db'
import users from '../../models/users'
import stories from '../../models/stories'
import contributors from '../../models/contributors'

describe('contributors model', () => {

    let johnId: UserId, janeId: UserId
    let storyId: StoryId
    let contributorJohn: ContributorId, contributorJane: ContributorId

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()

        johnId = 1
        janeId = 2

        const story = await stories.create('title', 'content')
        storyId = story.id
    })

    afterAll(async () => {
        await db.migrate.rollback()
    })

    test("total: 0", async() => {
        const all = await contributors.getAll()
        expect(all.length).toEqual(0)
    })

    test('create: john', async () => {
        const contributor = await contributors.add(johnId, storyId)
        expect(contributor.userId).toEqual(johnId)
        expect(contributor.storyId).toEqual(storyId)
        expect(contributor.id).toBeDefined()
        contributorJohn = contributor.id
    })

    test("total: 1", async() => {
        const all = await contributors.getAll()
        expect(all.length).toEqual(1)
    })

    test('create: jane', async () => {
        const contributor = await contributors.add(janeId, storyId)
        expect(contributor.userId).toEqual(janeId)
        expect(contributor.storyId).toEqual(storyId)
        expect(contributor.id).toBeDefined()
        contributorJane = contributor.id
    })

    test("total: 2", async() => {
        const all = await contributors.getAll()
        expect(all.length).toEqual(2)
    })

    test('remove by Id', async() => {
        const id = await contributors.removeById(johnId) 
        expect(id).toEqual(johnId)
    })

    test("total: 1", async() => {
        const all = await contributors.getAll()
        expect(all.length).toEqual(1)
    })

    test('remove by chatId and userId', async() => {
        const id = await contributors.remove(janeId, storyId)
        expect(id).toEqual(janeId)
    })

    test("total: 0", async() => {
        const all = await contributors.getAll()
        expect(all.length).toEqual(0)
    })
})