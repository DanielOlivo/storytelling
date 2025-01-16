process.env.NODE_ENV = 'test'

import request from 'supertest'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'

import app from '../../app'
import db from '../../config/db'
import { Credentials, User } from '../../../shared/src/Types'


describe('stories routes', () => {

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()
    })

    afterAll(async () => {
        await db.migrate.rollback()
    })


})