const jwt = require("jsonwebtoken");

function generatePolicyDocument(effect, methodArn) {
  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn
      }
    ]
  };

  return policyDocument;
}

function generateAuthResponse(principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument
  };
}

module.exports.handler = function verifyToken(event, context, callback) {
    console.log(event)
    const methodArn = event.methodArn
    const token = event.authorizationToken.replace("Bearer ", "");

    if (!token || !methodArn) {
      return callback(null, "Unauthorized");
    }

    const secret = Buffer.from(process.env.JWT_SECRET, "base64");
    const decoded = jwt.verify(token, secret);

    if (decoded && decoded.username) {
        return callback(null, generateAuthResponse(decoded.username, "Allow", methodArn));
    } else {
        return callback(null, generateAuthResponse(null, "Deny", methodArn));
    }
};