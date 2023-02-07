import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognitoIdp = new CognitoIdentityServiceProvider();

export const authenticateApiKey = async (event, context, callback) => {
  const apiKey = event.headers["x-api-key"];

  try {
    const params = {
      AccessToken: apiKey
    };
    const response = await cognitoIdp.getUser(params).promise();
    const username = response.Username;
    // Attach the username to the event object
    event.requestContext.authorizer = { username };
    callback(null, event);
  } catch (err) {
    // Return an error if the API key is invalid
    callback(null, {
      statusCode: 401,
      body: JSON.stringify({ error: err.message })
    });
  }
};