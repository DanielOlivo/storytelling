process.env.NODE_ENV = 'test'

import request from 'supertest'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'

import app from '../../app'
import db from '../../config/db'
import { Credentials, User } from '../../../shared/src/Types'

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
        const credentials = {
                username: 'newUser',
                password: 'password',
                email: 'newuser@gmail.com'
        } as Credentials

        const res = await request(app).post("/api/users/register")
            .send(credentials)

        const user = res.body as Partial<User>

        expect(res.status).toEqual(200)
        expect(user.username).toBeDefined()
        expect(user.username).toEqual('newUser')
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.email).toEqual('newuser@gmail.com')
    })

    test('registration with invalid email', async () => {
        const credentials = {
                username: 'newUser',
                password: 'password',
                email: 'newuser_gmail.com'
        } as Credentials

        const res = await request(app).post("/api/users/register")
            .send(credentials)

        expect(res.status).toEqual(400)
    })

    test('login: newUser', async() => {
        const res = await request(app).post('/api/users/login')
            .send({
                username: 'newUser',
                password: 'password'
            })

        expect(res.status).toEqual(200)

        const {message, token, user} = res.body
        expect(message).toBeDefined()
        expect(token).toBeDefined()
        expect(user).toBeDefined()
        expect(message).toEqual('success')

        const {id, username, email} = user
        expect(id).toBeDefined()
        expect(username).toBeDefined()
        expect(email).toBeDefined()
        expect(username).toEqual('newUser')
        expect(email).toEqual('newuser@gmail.com')
    })

    test('register: newUser (must be an error', async() => {
        const credentials = {
            username: 'newUser',
            password: 'password',
            email: 'newuser@gmail.com'
        } as Credentials

        const res = await request(app).post("/api/users/register")
            .send(credentials)

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
