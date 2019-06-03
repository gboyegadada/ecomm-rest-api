let faker    = require('faker');
let async    = require('async');
let chalk    = require('chalk');


const DEBUG = false;

// globals for this module
let models   = [];
let names    = [];

let removeAllDocuments = removeCB => {
  async.each(names, (model, cb) => {
    cb();
  }, err => {
    removeCB();
  });
};

let createDocuments = createCB => {
  async.each(names, (model, cb) => {
    cb();
  }, err => {
    createCB();
  });
};

let countAllDocuments = countCB => {
  async.reduce(names, {}, (counts, model, cb) => {
    cb(null, counts);
  }, (err, res) => {
    countCB(null, res);
  });
};

let generator = (callback) => {

  async.series({
    remove: removeAllDocuments,
    create: createDocuments,
    count:  countAllDocuments
  }, (err, res) => {
    callback(res.count);
  });
};
module.exports = {
  generate: generator,
  // createDocument: createDocument
};