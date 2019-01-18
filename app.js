const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Post {
                _id: ID!
                title: String!
                creator: String!
                createDate: String!
                text: String!

            }

            input PostInput {
                title: String!
                creator: String!
                createDate: String!
                text: String!
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
                return Post
                .find()
                .then(posts => {
                    return posts.map(post => {
                        return { ...post._doc, _id: post._doc._id.toString() };
                    });
                })
                .catch(err => {
                    throw err;
                });
            },
            createPost: args => {
                const post = new Post({
                    title: args.postInput.title,
                    creator: args.postInput.creator,
                    createDate: new Date(args.postInput.createDate),
                    text: args.postInput.text
                })
                return post
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc, _id: result._doc._id.toString() };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            }
        },
        graphiql: true
    })
);

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
        }@cluster0-o6xft.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
    ).then(() => {
    app.listen(3130);
}).catch(err => {
    console.log(err);
});

