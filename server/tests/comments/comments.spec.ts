process.env.NODE_ENV = 'test'

import {type AddressInfo} from "node:net"
import io, {httpServer} from '../../socketServer'
import {describe, test, expect, beforeEach, beforeAll, afterAll} from '@jest/globals'
import {io as ioc, Socket as ClientSocket} from 'socket.io-client'
import { Server, type Socket as ServerSocket } from "socket.io";
// import { createServer } from "node:http";


describe('socket: comments', () => {

    // let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;
    let serverSocket: ServerSocket, clientSocket: ClientSocket;

    beforeAll(async () => {
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            // console.log('port', port)
            clientSocket = ioc(`http://localhost:${port}`);
            clientSocket.on("connect", () => {
                // console.log('connected')
                // console.log('connected', clientSocket.connected)
            });
        });
        await wait(200)
    });

    afterAll(() => {
        io.close();
        clientSocket.disconnect();
    });


    function waitWith(setup: (resolver: (arg: any) => void) => void, action: () => void){
        return new Promise(res => {
            setup(res) 
            setTimeout(() => action(), 300)
        })
    }

    test('msg', async() => {
        clientSocket.emit('msg', 'dude')
        await wait(300)
    })

    test('CommentPostRequest -> Comment', async() => {
        await waitWith(done => {
            clientSocket.on('comment', comment => {
                console.log('someone posted', comment)
                done(null)
            })
        }, () => {
            const req = {
                userId: 1,
                storyId: 1,
                content: "HEEEEY"
            }
            clientSocket.emit('comment_post', req)
        })
    })

    // test("should work", async () => {
    //     await waitFor((done) => {
    //         clientSocket.on('hello', arg => {
    //             expect(arg).toEqual('world')
    //             done(null)
    //         })
    //     }, () => {
    //         serverSocket.emit('hello', 'world')
    //     })
    // });




    // test('just send', async() => {
    //     console.log('emitting...')
    //     client.emit('msg', 'duudes') 
    // })

    test('sanity check', () => {
        expect(1).toEqual(1)
    })
})

function wait(ms: number): Promise<void>{
    return new Promise(res => setTimeout(() => res(), ms))
}