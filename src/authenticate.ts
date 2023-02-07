import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Callback,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    const apiKey = event.headers.Authorization.replace("Bearer ", "");
    if (!apiKey) {
      callback(null, {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized: API key is required",
        }),
      });
      return;
    }
    let response = {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized: Invalid API key",
      }),
    };
    if (apiKey === "zee") {
      response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Authentication successful" }),
      };
    }

    callback(null, response);
    return;
  } catch (err) {
    console.error(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : "some error happened",
      }),
    };
  }
  return response;
};
