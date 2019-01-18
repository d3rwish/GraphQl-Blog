const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Post = require('./models/post');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema: buildSchema(`
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
                creator: String
                text: String!
            }

            input UserInput {
                email: String!
                password: String!
            }

            type RootQuery {
                posts: [Post!]!
            }

            type RootMutation {
                createPost(postInput: PostInput): Post
                createUser(userInput: UserInput): User
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
                    creator: '5c4245d2a2fae6202ce4bb08',
                    createDate: new Date().toLocaleString(), // To change in the production environment. Generated on the browser side (locale Time)
                    text: args.postInput.text
                });
                let createdPost;
                return post
                .save()
                .then(result => {
                    createdPost = { ...result._doc, _id: result._doc._id.toString() };
                    return User.findById('5c4245d2a2fae6202ce4bb08');
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found.')
                    }
                    user.createdPosts.push(post);
                    return user.save();
                })
                .then(result => {
                    return createdPost;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            },
            createUser: args => {
                return User.findOne({email: args.userInput.email})
                .then(user => {
                    if (user) {
                        throw new Error('User already exist.')
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword,
                        signUpDate: new Date().toLocaleString() // To change in the production environment. Generated on the browser side (locale Time)
                    });
                    return user.save();
                })
                .then(result => {
                    return { ...result._doc, _id: result._doc._id.toString(), password: null };
                })
                .catch(err => {
                    throw err;
                });
            },
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

