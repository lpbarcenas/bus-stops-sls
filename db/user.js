const AWS = require("aws-sdk");
const { Model } = require("dynamodb-toolbox");
const bcrypt = require("bcryptjs");

AWS.config.update({  region: process.env.REGION });
const dbClient = new AWS.DynamoDB.DocumentClient();

const User = new Model("User", {
  table: "users",
  partitionKey: "usernamePrimary",
  sortKey: "usernameSort",
  schema: {
    usernamePrimary: { type: "string", alias: "username" },
    usernameSort: { type: "string", hidden: true },
    password: { type: "string" },
  }
});


const createUser = async props => {
  const passwordHashed = await bcrypt.hash(props.password, 8);
  delete props.password;
  const args = User.put({
    usernamePrimary: props.username,
    usernameSort: props.username,
    username: props.username,
    password: passwordHashed
  });

  const result = await dbClient.put(args).promise();

  return User.parse(result);
};

const getUserByUsername = async username => {
  const args = User.get({ username, usernameSort: username });
  const result = await dbClient.get(args).promise();
  return User.parse(result);
};

module.exports = {
  createUser,
  getUserByUsername
};