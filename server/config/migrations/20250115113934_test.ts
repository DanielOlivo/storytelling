import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', table => {
        table.increments('id').notNullable().primary()
        table.string('username').unique().notNullable()
        table.string('email').unique().notNullable()
        table.string('hashed').notNullable()
    })

    await knex.schema.createTable('stories', table => {
        table.increments('id').primary()
        table.string('title').notNullable()
        table.string('content').notNullable()
        table.timestamp('created').notNullable().defaultTo(knex.fn.now())
        table.timestamp('updated').notNullable().defaultTo(knex.fn.now())
    })

    await knex.schema.createTable('contributors', table => {
        table.increments('id').primary()
        table.integer('storyId').notNullable()
        table.integer('userId').notNullable()

        table.foreign('userId').references('id').inTable('users').onDelete('CASCADE')
        table.foreign('storyId').references('id').inTable('stories').onDelete('CASCADE')
    }) 

    await knex.schema.createTable('comments', table => {
        table.increments('id').primary()
        table.integer('userId').notNullable()
        table.integer('storyId').notNullable()
        table.string('content').notNullable()
        table.timestamp('created').defaultTo(knex.fn.now())

        table.foreign('userId').references('id').inTable('users').onDelete('CASCADE')
        table.foreign('storyId').references('id').inTable('stories').onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('comments')
    await knex.schema.dropTableIfExists('contributors')
    await knex.schema.dropTableIfExists('stories')
    await knex.schema.dropTableIfExists('users')
}

