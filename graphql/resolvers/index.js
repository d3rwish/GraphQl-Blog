const bcrypt = require('bcryptjs');

const Post = require('../../models/post');
const User = require('../../models/user');

const posts = postIds => {
    return Post.find({_id: {$in: postIds}})
    .then(posts => {
        return posts.map(post => {
            return {
                ...post._doc,
                _id: post.id,
                creator: user.bind(this, post.creator)
            }
        })
    })
    .catch(err => {
        throw err;
    });
};

const user = userID => {
    return User.findById(userID)
    .then(user => {
        return {
            ...user._doc,
            _id: user.id,
            createdPosts: posts.bind(this, user._doc.createdPosts),
            password: null
        };
    })
    .catch(err => {
        throw err;
    });
};

module.exports = {
    posts: () => {
        return Post
        .find()
        .then(posts => {
            return posts.map(post => {
                return {
                    ...post._doc,
                    _id: post._doc._id,
                    creator: user.bind(this, post._doc.creator)
                };
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
            createDate: new Date().toLocaleString(), // To change in the production environment. Generated on the browser side (locale Time)
            text: args.postInput.text
        });
        let createdPost;
        return post
        .save()
        .then(result => {
            createdPost = {
                ...result._doc,
                _id: result._doc._id,
                creator: user.bind(this, result._doc.creator)
            };
            return User.findById(post.creator);
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
            return {
                ...result._doc,
                _id: result._doc._id,
                password: null
            };
        })
        .catch(err => {
            throw err;
        });
    },
}