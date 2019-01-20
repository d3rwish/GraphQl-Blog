const authResolver = require('./auth');
const postsResolver = require('./posts');
const usersResolver = require('./users');

const rootResolver = {
    ...authResolver,
    ...postsResolver,
    ...usersResolver,
};

module.exports = rootResolver;