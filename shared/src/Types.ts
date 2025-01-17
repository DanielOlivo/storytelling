export type Password = string

export type UserId = number
export type StoryId = number

export type ContributorId = number

export type CommentId = string

export interface User {
    id: UserId
    username: string
    email: string
    hashed: Password
}

export interface Story {
    id: StoryId

    title: string
    content: string

    created?: Date
    edited?: Date
}

export interface Contributor {
    id: ContributorId
    userId: UserId
    storyId: StoryId
}

// export interface Comment {
//     id: CommentId
//     sender: UserId
//     post: StoryId

//     content: string
// }

export interface Credentials {
    username: string
    password: string
    email: string
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface LoginResponse {
    message: string
    user: {id: UserId, username: string, email: string}
    token: string
}

export interface StoryUpdate {
    // creator: UserId
    title: string 
    content: string
}

export interface StoryEdit {
    // actorId: UserId
    // story: Story
    storyId: number
    title: string 
    content: string
}

export interface StoryDelete {
    storyId: StoryId
    // actorId: UserId
}

export interface CollabAction {
    // actorId: UserId
    userId: UserId
    storyId: StoryId
}

export interface AuthPayload {
    id: UserId
    username: string
    email: string
}

export interface Comment {
    id: CommentId,
    storyId: StoryId
    userId: UserId
    content: string
    created: Date
    edited?: Date
}

/**
CREATE TABLE Users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash TEXT NOT NULL
); 
 
CREATE TABLE Stories (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
author_id INT REFERENCES Users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Contributors (
id SERIAL PRIMARY KEY,
story_id INT REFERENCES Stories(id),
user_id INT REFERENCES Users(id)
);

 * 
 */