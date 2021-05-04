const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByUsername } = require("../db/user");

module.exports.handler = async function signInUser(event) {
  const body = JSON.parse(event.body);

  return login(body)
    .then(session => ({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers" : "Content-Type"
      },
      body: JSON.stringify(session)
    }))
    .catch(err => {

      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    });
};


async function login(args) {
    try {
      const user = await getUserByUsername(args.username);
      const isValidPassword = await bcrypt.compare(args.password, user.password);
  
      let auth = false;
      let token = null;
      let status = "FAILED";

      if (isValidPassword) {
        token = await signToken(user);
        authResult = true;
        status = "SUCCESS";
      }
      return Promise.resolve({ auth: auth, token: token, status: status });
    } catch (err) {
      return Promise.reject(new Error(err));
    }
  }
  
  function comparePassword(eventPassword, userPassword) {
    return bcrypt.compare(eventPassword, userPassword);
  }

  async function signToken(user) {
    const secret = Buffer.from(process.env.JWT_SECRET, "base64");
    return jwt.sign({ username: user.username, }, secret, {
      expiresIn: 86400
    });
  }