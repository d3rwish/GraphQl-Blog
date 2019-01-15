const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const posts = [];

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Post {
                _id: ID!
                title: String!
                creator: String!
                date: String!

            }

            input PostInput {
                title: String!
                creator: String!
                date: String!
            }

            type RootQuery {
                posts: [Post!]!
            }

            type RootMutation {
                createPost(postInput: PostInput): Post
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            posts: () => {
                return posts;
            },
            createPost: (args) => {
                const post = {
                    _id: Math.random().toString(),
                    title: args.postInput.title,
                    creator: args.postInput.creator,
                    date: args.postInput.date
                };
                posts.push(post);
                return post;
            }
        },
        graphiql: true
    })
);

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
    @cluster0-o6xft.mongodb.net/test?retryWrites=true`
).then(() => {
    app.listen(3130);
}).catch(err => {
    console.log(err);
});

