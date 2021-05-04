const AWS = require("aws-sdk");
const _ = require('lodash');

AWS.config.update({  region: process.env.REGION });
const dbClient = new AWS.DynamoDB.DocumentClient();

const getBusstopByLocation = async args => {
  
  // PREDEFINED
  const centerPoint = {
    lat: 8.4788611,
    lng: 124.6511352
  }
  const withinKmRadius = 2;

  const params = {
    TableName: process.env.BUS_STOP_TABLE,
  };
  const result = await dbClient.scan(params).promise();

  let qualifiedBusStops = [];
  if (_.isObject(result) && result.hasOwnProperty("Items") && result.Items ) {
    result.Items.forEach(function(item) {
      if (item.lat && item.lng) {
        try {
          if (isProximate({ lat: item.lat, lng: item.lng }, centerPoint, withinKmRadius)) {
            qualifiedBusStops.push(item)
          }
        } catch (e) {
          console.log("Error: " + e)
        }
        
      }
    });
  }

  return qualifiedBusStops
}

function isProximate(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

module.exports = {
  getBusstopByLocation
};