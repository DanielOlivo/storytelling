process.env.NODE_ENV = 'test'

import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'
import { User, UserId } from '../../../shared/src/Types'
import db from '../../config/db'
import users from '../../models/users'


describe('users model', () => {

    let newUserId: UserId;

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()
    })

    afterAll(async () => {
        await db.migrate.rollback()
    })

    test('getAll', async() => {

        const result = await users.getAll()
        expect(result.length).toEqual(2)
        
        const [jane, john] = result
        expect(jane.username).toEqual('jane.doe')
        expect(john.username).toEqual('john.doe')
    })

    test('get john by id', async () => {
        const john: User = await users.getById(1)
        expect(john.username).toEqual('john.doe')        
        expect(john.hashed).toEqual('pass')
    })

    test('get jane by id', async () => {
        const jane: User = await users.getById(2)
        expect(jane.username).toEqual('jane.doe')        
        expect(jane.hashed).toEqual('word')
    })

    test('newUser: create', async () => {
        // console.log('about to insert')
        // console.log('all', await users.getAll())
        const user = await users.create('newUser', 'user@gmail.com', 'secret_password')
        // console.log('user',user)
        expect(user.username).toEqual('newUser')
        expect(user.hashed).toEqual('secret_password')
        expect(user.email).toEqual('user@gmail.com')
        newUserId = user.id
    })

    test('newUser: update password', async() => {
        await users.updatePassword(newUserId, 'new_password')

        // get user
        const user = await users.getById(newUserId)
        expect(user.hashed).toEqual('new_password')
    })

    test('getAll: must be 3', async () => {
        const _users = await users.getAll()
        expect(_users.length).toEqual(3)
    })

    test('getByUsername: john.doe', async () => {
        const john = await users.getByUsername('john.doe')
        expect(john.id).toEqual(1)
        expect(john.hashed).toEqual('pass')
    })

    test('getByUsername: jane.doe', async () => {
        const jane = await users.getByUsername('jane.doe')
        expect(jane.id).toEqual(2)
        expect(jane.hashed).toEqual('word')
    })

    test('getByUsername: nonexisting', async() => {
        const nonExisting = await users.getByUsername('nonexisting')
        expect(nonExisting).toBeUndefined()
    })

    test('getByUsername: jane.doe', async () => {
        const user = await users.getByUsername('newUser')
        expect(user.id).toEqual(newUserId)
        expect(user.hashed).toEqual('new_password')
    })

    test('findByUsername: .doe', async() => {
        const result = await users.findByUsername('.doe')
        expect(result.length).toEqual(2)
    })

    test('findByUsername: user', async() => {
        const result = await users.findByUsername('user')
        expect(result.length).toEqual(1)
    })

    test('newUser: remove', async () => {
        const id = await users.remove(newUserId)
        expect(id).toEqual(newUserId)
    })
})