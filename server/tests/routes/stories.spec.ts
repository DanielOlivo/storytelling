process.env.NODE_ENV = 'test'

import request from 'supertest'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'

import app from '../../app'
import db from '../../config/db'
import { Contributor, Credentials, StoryUpdate, User, UserId, Story, StoryId, StoryEdit, CollabAction, StoryDelete } from '../../../shared/src/Types'


describe('stories routes', () => {

    let johnId: UserId 
    let janeId: UserId
    let storyId: StoryId

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()

        johnId = 1 
        janeId = 2
    })

    afterAll(async () => {
        await db.migrate.rollback()
    })

    test('create', async() => {
        const payload = {
            creator: johnId,
            title: 'title',
            content: 'content'
        } as StoryUpdate

        const res = await request(app)
            .post("/api/stories")
            .send(payload)
            
        expect(res.status).toEqual(200)

        const {story, contributor} = res.body as {story: Story, contributor: Contributor}
        expect(story).toBeDefined()
        expect(contributor).toBeDefined()
        expect(contributor.userId).toEqual(1)
        expect(story.id).toEqual(contributor.storyId)
        expect(story.title).toEqual('title')
        expect(story.content).toEqual(('content'))

        storyId = story.id
    })

    test('edit', async() => {
        const payload = {
            actorId: 1,
            story: {
                id: storyId,
                title: 'updated title',
                content: 'updated content'           
            }
        } as StoryEdit

        const res = await request(app)
            .put("/api/stories")
            .send(payload)
        
        expect(res.status).toEqual(200)
        
        const story = res.body as Story
        expect(story).toBeDefined()
        expect(story.id).toEqual(storyId)
        expect(story.title).toEqual('updated title')
        expect(story.content).toEqual('updated content')
    })

    test('add contributor', async() => {
        const payload = {
            actorId: 1, // john
            userId: 2, // jane
            storyId
        } as CollabAction

        const res = await request(app)
            .post("/api/contributors")
            .send(payload)

        expect(res.status).toEqual(200)
        const contributor = res.body as Contributor
        expect(contributor).toBeDefined()
        expect(contributor.userId).toEqual(2)
        expect(contributor.storyId).toEqual(storyId)
    })

    test('remove contributor', async () => {
        const payload = {
            actorId: 1, // john
            userId: 2, // jane
            storyId
        } as CollabAction

        const res = await request(app)
            .delete("/api/contributors")
            .send(payload)

        expect(res.status).toEqual(200)
    })

    test('remove', async() => {
        const payload = {actorId: 1, storyId} as StoryDelete

        const res = await request(app)
            .delete("/api/stories")
            .send(payload)

        expect(res.status).toEqual(200)

        const {id} = res.body as {id: StoryId}
        expect(id).toBeDefined()
        expect(id).toEqual(storyId)
    })
})