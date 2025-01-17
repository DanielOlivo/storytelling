process.env.NODE_ENV = 'test'

import request from 'supertest'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'

import app from '../../app'
import db from '../../config/db'
import { Contributor, Credentials, LoginCredentials, StoryUpdate, User, UserId, Story, StoryId, StoryEdit, CollabAction, StoryDelete, AuthPayload, LoginResponse } from '../../../shared/src/Types'


describe('stories routes', () => {

    let johnId: UserId 
    let janeId: UserId
    let storyId: StoryId
    let token: string

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

    test('login...', async () => {
        const credentials = {
            username: 'john.doe',
            password: 'pass'
        } as LoginCredentials

        const res = await request(app)
            .post('/api/users/login')
            .send(credentials)

        expect(res.status).toEqual(200)

        const payload = res.body as LoginResponse
        expect(payload).toBeDefined()
        expect(payload.message).toEqual('success') 
        token = payload.token
    }) 

    test('create', async() => {
        const payload: StoryUpdate = {
            // creator: johnId,
            title: 'title',
            content: 'content'
        }

        const res = await request(app)
            .post("/api/stories")
            .set('Cookie', ['token=' + token])
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

    test('get all', async () => {
        const res = await request(app)
            .get("/api/stories")
            .set("Cookie", ['token=' + token])

        expect(res.status).toEqual(200)

        const johnStories = res.body as Story[]
        expect(johnStories).toBeDefined()
        expect(johnStories.length).toEqual(1)
    })

    test('edit', async() => {
        const payload: StoryEdit = {
            storyId,
            title: 'updated title',
            content: 'updated content'           
        } 

        const res = await request(app)
            .put("/api/stories")
            .set("Cookie", ['token=' + token])
            .send(payload)
        
        expect(res.status).toEqual(200)
        
        const story = res.body as Story
        expect(story).toBeDefined()
        expect(story.id).toEqual(storyId)
        expect(story.title).toEqual('updated title')
        expect(story.content).toEqual('updated content')
    })

    test('add contributor', async() => {
        const payload: CollabAction = {
            userId: 2, // jane
            storyId
        }

        const res = await request(app)
            .post("/api/contributors")
            .set("Cookie", ['token=' + token])
            .send(payload)

        expect(res.status).toEqual(200)
        const contributor = res.body as Contributor
        expect(contributor).toBeDefined()
        expect(contributor.userId).toEqual(2)
        expect(contributor.storyId).toEqual(storyId)
    })

    test('remove contributor', async () => {
        const payload: CollabAction = {
            userId: 2, // jane
            storyId
        }

        const res = await request(app)
            .delete("/api/contributors")
            .set("Cookie", ['token=' + token])
            .send(payload)

        expect(res.status).toEqual(200)
    })

    test('remove story', async() => {
        const payload: StoryDelete = {storyId}

        const res = await request(app)
            .delete("/api/stories")
            .set('Cookie', ['token=' + token])
            .send(payload)

        expect(res.status).toEqual(200)

        const {id} = res.body as {id: StoryId}
        expect(id).toBeDefined()
        expect(id).toEqual(storyId)
    })
})