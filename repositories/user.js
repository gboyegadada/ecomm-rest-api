const db = require('../db');

module.exports = {
    findAll: (params, done) => {
        return done(null, []);
    },

    find: (id, done) => {
        return done(null, {});
    },

    findOneBy: (params, done) => {
        return done(null, []);
    }
};