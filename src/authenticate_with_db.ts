import { DBUtil } from "./utils/db-util";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ACCOUNT_COLLECTION, DB_NAME } from "./constants";

export async function authenticate(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: any
) {
  context.callbackWaitsForEmptyEventLoop = false;
  const apiKey = event.headers.Authorization.replace("Bearer ", "");
  const mongoDb = await DBUtil.connectToMongo();
  const redisClient = await DBUtil.connectToRedis();
  if (!apiKey) {
    console.log("API Key missing");
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({ error: "API Key missing" }),
    });
  }
  try {
    const apiKeyValue = await redisClient.get(apiKey);
    if (apiKeyValue) {
      console.log("found via redis");
      return;
    }
    const db = mongoDb.db(DB_NAME);
    const apiKeyCollection = db.collection(ACCOUNT_COLLECTION);
    const key = await apiKeyCollection.findOne({ apiKey: apiKey });
    if (!key) {
      return callback(null, {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid API key. Tried MongoDB" }),
      });
    }
    await redisClient.set(apiKey, key._id.toString(), { EX: 60 * 60 * 24 });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Authentication successful" }),
    };
  } catch (err) {
    throw err;
  } finally {
    DBUtil.closeConnections();
  }
}
