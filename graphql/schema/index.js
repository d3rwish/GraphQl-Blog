const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Post {
    _id: ID!
    title: String!
    creator: User!
    creationDate: String!
    content : String!
    comments: [Comment!]
}

type User {
    _id: ID!
    email: String!
    name: String!
    password: String
    signUpDate: String!
    role: String!
    createdPosts: [Post!]
    createdComments: [Comment!]
}

type Comment {
    _id: ID!
    creator: User!
    creationDate: String!
    content : String!
}

input PostInput {
    title: String!
    creator: String!
    content: String!
}

input UserInput {
    email: String!
    password: String!
    name: String!
    role: String!
}

input CommentInput {
    creator: String!
    content : String!
}

type RootQueries {
    allPosts: [Post!]!
    singlePost(postId: ID!): Post!
    userPosts(userId: ID!): [Post!]!

    allUsers: [User!]!
    singleUser(userId: ID!): User!

    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createPost(postInput: PostInput): Post
    createUser(userInput: UserInput): User
}

type AuthData {
    userId: ID!
    userToken: String!
    userTokenExp: Int!
}

schema {
    query: RootQueries
    mutation: RootMutation
}
`)