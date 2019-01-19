const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Post {
    _id: ID!
    title: String!
    creator: User!
    createDate: String!
    text: String!
}

type User {
    _id: ID!
    email: String!
    password: String
    signUpDate: String!
    createdPosts: [Post!]
}

input PostInput {
    title: String!
    creator: String!
    text: String!
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery {
    posts: [Post!]!
    users: [User!]!
}

type RootMutation {
    createPost(postInput: PostInput): Post
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)