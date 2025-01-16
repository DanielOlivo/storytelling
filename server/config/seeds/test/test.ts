import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // await knex("users").del();
    // await knex('stories').del()
    // await knex('contributors').del()

    await knex("users").insert([
        // { id: 1, username: "john.doe", email: "john.doe@gmail.com", hashed: "pass" },
        // { id: 2, username: "jane.doe", email: "jane.doe@gmail.com", hashed: "word" },
        { username: "john.doe", email: "john.doe@gmail.com", hashed: "pass" },
        { username: "jane.doe", email: "jane.doe@gmail.com", hashed: "word" },
    ]);
};
