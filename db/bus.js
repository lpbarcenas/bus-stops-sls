const AWS = require("aws-sdk");
const _ = require('lodash');

AWS.config.update({  region: process.env.REGION });
const dbClient = new AWS.DynamoDB.DocumentClient();

const getBusesInBusStop = async args => {
  const bus_stop_id = args.bus_stop_id;
  const params = {
    TableName: process.env.BUS_TABLE,
    FilterExpression: 'bus_stop_id = :bus_stop_id',
    ExpressionAttributeValues: {
      ":bus_stop_id": bus_stop_id
    }
  };
  const result = await dbClient.scan(params).promise();
  let busList = [];
  if (_.isObject(result) && result.hasOwnProperty("Items") && result.Items ) {
    result.Items.forEach(function(item) {
        busList.push(item)
    });
  }

  return busList
}

module.exports = {
    getBusesInBusStop
};