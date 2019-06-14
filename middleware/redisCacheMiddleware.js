const redisClient = require('../services/redis');

// create redis middleware
let redisCacheMiddleware = (req, res, next) => {
    let key = "__reqcache__" + req.originalUrl || req.url;
    redisClient.get(key, function(err, reply){
        if(reply && 'test' !== process.env.NODE_ENV){
            res.setHeader('Content-Type', 'application/json');
            res.send(reply);
        }else{
            res.sendResponse = res.send;
            res.send = (body) => {
                redisClient.set(key, body);
                res.sendResponse(body);
            }
            next();
        }
    });
};

module.exports = redisCacheMiddleware;