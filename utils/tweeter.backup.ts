import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import TwitterApi from "twitter-api-v2";

require("dotenv").config();

// Remplacez par vos propres informations d'identification
let config = {
  appKey: process.env.X_API_KEY as string,
  appSecret: process.env.X_API_SECRET as string,
  accessToken: process.env.X_ACCESS_TOKEN as string,
  accessSecret: process.env.X_ACCESS_SECRET as string,
};

console.log("config", config);
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
// export async function getBearerToken() {
//   const credentials = Buffer.from(
//     `${config.appKey}:${config.appSecret}`
//   ).toString("base64");
//   const response = await axios.post(
//     "https://api.twitter.com/oauth2/token",
//     "grant_type=client_credentials",
//     {
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//       },
//     }
//   );
//   return response.data.access_token;
// }

// export const download = (uri: string, filename: string, callback: any) => {
//   request.head(uri, function (err, res, body) {
//     request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
//   });
// };

// export async function uploadMedia(imagePath: string, token: string) {
//   const formData = new FormData();
//   let imageData = fs.createReadStream(imagePath);
//   console.log({ imageData });
//   formData.append("media_data", imageData);

//   const response = await axios.post(
//     "https://upload.twitter.com/1.1/media/upload.json",
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         ...formData.getHeaders(),
//       },
//     }
//   );

//   return response.data.media_id_string;
// }

// export async function tweetWithImage(
//   text: string,
//   mediaId: string,
//   token: string
// ) {
//   const response = await axios.post(
//     "https://api.twitter.com/1.1/statuses/update.json",
//     {
//       status: text,
//       media_ids: mediaId,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   console.log("Tweet publié avec succès!", response.data);
// }

// // // Créez une nouvelle instance de l'API Twitter
// // const client = new TwitterApi(config);

// // // Function to post a tweet with an image
// // export async function postTweet(status: string, imagePath: string) {
// //   try {
// //     // Read image file
// //     const imageData = fs.readFileSync(imagePath);

// //     // Upload image to Twitter
// //     const media = await client.v1.uploadMedia(imageData, {
// //       mimeType: "image/png",
// //     });
// //     console.log({ media });
// //     // Post tweet with image
// //     const tweet = await client.v1.tweet(status, { media_ids: [media] });
// //     console.log(`Tweet with image published successfully: ${tweet.id}`);
// //   } catch (error) {
// //     console.error(`Error while posting tweet with image: ${error}`);
// //   }
// // }
