import { Knex } from "knex";
import {hash} from 'bcrypt'

export async function seed(knex: Knex): Promise<void> {
    // await knex("users").del();
    // await knex('stories').del()
    // await knex('contributors').del()
    const saltRounds = 10
    const johnPasswordHash = await hash('pass', saltRounds)
    const janePasswordHash = await hash('word', saltRounds)

    await knex("users").insert([
        // { id: 1, username: "john.doe", email: "john.doe@gmail.com", hashed: "pass" },
        // { id: 2, username: "jane.doe", email: "jane.doe@gmail.com", hashed: "word" },


        // { username: "john.doe", email: "john.doe@gmail.com", hashed: "pass" },
        // { username: "jane.doe", email: "jane.doe@gmail.com", hashed: "word" },
        { username: "john.doe", email: "john.doe@gmail.com", hashed: johnPasswordHash },
        { username: "jane.doe", email: "jane.doe@gmail.com", hashed: janePasswordHash },
    ]);
};
