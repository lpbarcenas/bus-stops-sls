'use strict';
const _ = require('lodash');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
  
const { createUser } = require("./db/user");
const { getBusstopByLocation } = require("./db/busstop");
const { getBusesInBusStop } = require("./db/bus");

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Credentials" : true
    },
    body: JSON.stringify(message)
  };
}

module.exports.readBusStop = async(event, context, callback) => {
  const body = _.isObject(event) && event.hasOwnProperty("body") ? JSON.parse(event.body) : event ;
  return await getBusstopByLocation(body)
    .then(busstops => {
      callback(null, response(200, { results: busstops } ));
    })
    .catch(err => {
      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    })
};


module.exports.getBusStop = async(event, context, callback) => {
  console.log(event)
  const body = _.isObject(event) && event.hasOwnProperty("pathParameters") ? event.pathParameters : event ;
  return await getBusesInBusStop(body)
    .then(busList => {
      callback(null, response(200, { results: busList } ));
    })
    .catch(err => {
      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    })
};

module.exports.register = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  return await createUser(body)
    .then(user => ({
      statusCode: 200,
      body: JSON.stringify(user)
    }))
    .catch(err => {
      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    })
};
