import TwitterApi from "twitter-api-v2";
require("dotenv").config();

let config = {
  appKey: process.env.X_API_KEY as string,
  appSecret: process.env.X_API_SECRET as string,
  accessToken: process.env.X_ACCESS_TOKEN as string,
  accessSecret: process.env.X_ACCESS_SECRET as string,
};

const client = new TwitterApi(config);
const bearer = new TwitterApi(process.env.X_BEARER_TOKEN as string);
export const twitterClient = client.readWrite;
export const twitterBearer = bearer.readWrite;

export const tweetWithImage = async (status: string) => {
  try {
    console.log("start build tweet with image");
    const mediaId = await twitterClient.v1.uploadMedia("./code-image.png");
    console.log("mediaId", mediaId);
    await twitterClient.v2.tweet({
      text: status,
      media: {
        media_ids: [mediaId],
      },
    });
    console.log("tweeted with image done");
  } catch (error) {
    console.log("Error while posting tweet with image: ", error);
  }
};
