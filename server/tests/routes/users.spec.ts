process.env.NODE_ENV = 'test'

import request from 'supertest'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'

import app from '../../app'
import db from '../../config/db'
import { User } from '../../../shared/src/Types'

describe('user routes', () => {

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()
    })

    afterAll(async () => {
        await db.migrate.rollback()
    })

    test('register: newUser', async() => {
        const res = await request(app).post("/api/users/register")
            .send({
                username: 'newUser',
                hashed: 'password',
                email: 'newuser@gmail.com'
            })

        const user = res.body as Partial<User>

        console.log('res', user)

        expect(res.status).toEqual(200)
        expect(user.username).toBeDefined()
        expect(user.username).toEqual('newUser')
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.email).toEqual('newuser@gmail.com')
    })

    test('login: newUser', async() => {
        const res = await request(app).post('/api/users/login')
            .send({
                username: 'newUser',
                password: 'password'
            })

        const data = res.body
        // console.log(data)

        expect(res.status).toEqual(200)
    })

    test('register: newUser (must be an error', async() => {
        const res = await request(app).post("/api/users/register")
            .send({
                username: 'newUser',
                hashed: 'password',
                email: 'newuser@gmail.com'
            })

        expect(res.status).toEqual(400)
        expect(res.body.message).toBeDefined()
    })
    
    test('login: newUser with wrong password', async() => {
        const res = await request(app).post('/api/users/login')
            .send({
                username: 'newUser',
                password: 'wrongpassword'
            })
        expect(res.status).toEqual(400)
        expect(res.body.message).toBeDefined()
    })

    test('login: unexisting user tries', async() => {
        const res = await request(app).post('/api/users/login')
            .send({
                username: 'doesNotExist',
                password: 'password'
            })
        expect(res.status).toEqual(400)
        expect(res.body.message).toBeDefined()
    })
})
