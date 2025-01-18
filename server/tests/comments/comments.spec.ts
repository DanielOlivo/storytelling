process.env.NODE_ENV = 'test'

import {type AddressInfo} from "node:net"
import request from 'supertest'
import io, {httpServer} from '../../socketServer'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'
import {io as ioc, Socket as ClientSocket} from 'socket.io-client'
import { Server, type Socket as ServerSocket } from "socket.io";
import jwt from 'jsonwebtoken'
import db from '../../config/db'
import app from '../../app'
import { Comment, CommentPosted, CommentPostRequest, CommentRemoved, CommentRemoveRequest, StoryUpdate, type Story } from "../../../shared/src/Types"

// import { createServer } from "node:http";


describe('socket: comments', () => {

    // let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;
    let serverSocket: ServerSocket, clientSocket: ClientSocket;
    let story: Story
    let comment: Comment

    beforeAll(async () => {
        await db.migrate.rollback()
        await db.migrate.latest()
        await db.seed.run()

        const tokenPayload = {
            id: 1,
            username: 'john.doe',
            email: 'john.doe@gmail.com'
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string)

        const payload: StoryUpdate = {
            title: 'some title',
            content: 'some content'
        }

        const res = await request(app)
            .post('/api/stories')
            .set('Cookie', ['token=' + token])
            .send(payload)

        story = res.body.story

        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            // const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string)
            // console.log('token: ', token)

            // console.log('port', port)
            clientSocket = ioc(`http://localhost:${port}`, {
                auth: {token}
            });
            clientSocket.on("connect", () => {
                // console.log('connected')
                // console.log('connected', clientSocket.connected)
            });
        });
        await wait(200)
    });

    afterAll(async () => {
        io.close();
        clientSocket.disconnect();

        await db.migrate.rollback()
    });


    function waitWith(setup: (resolver: (arg: any) => void) => void, action: () => void){
        return new Promise(res => {
            setup(res) 
            setTimeout(() => action(), 300)
        })
    }

    test('post comment', async() => {
        await waitWith(done => {
            clientSocket.on('comment_posted', (posted: CommentPosted)  => {
                comment = posted.posted
                expect(comment.storyId).toEqual(story.id)
                expect(comment.content).toEqual('HEEEEY')
                expect(comment.userId).toEqual(1)
                done(null)
            })
        }, () => {
            const req = {
                storyId: story.id,
                content: "HEEEEY"
            } as CommentPostRequest

            clientSocket.emit('comment_post', req)
        })
    })

    test('remove comment', async() => {
        await waitWith(done => {
            clientSocket.on('comment_removed', (removed: CommentRemoved) => {
                expect(removed.id).toEqual(comment.id)
                done(null)
            })
        }, () => {
            const req = {
                id: comment.id
            } as CommentRemoveRequest
            clientSocket.emit('comment_remove', req)
        })
    }) 

})

function wait(ms: number): Promise<void>{
    return new Promise(res => setTimeout(() => res(), ms))
}