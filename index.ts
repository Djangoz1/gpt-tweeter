import { tweetWithImage } from "./utils/tweeter";
import { generateCodeImage } from "./utils/puppeteer";
import { openAiRequest } from "./utils/openai";

require("dotenv").config();

async function main() {
  console.log("Start generate cron job");
  let response = await openAiRequest();
  if (response === null) {
    throw new Error("Problem with openAI");
  }
  let { code, astuce } = response as { code: string; astuce: string };

  if (!code && !astuce) {
    throw new Error("La réponse est vide");
  } else {
    await generateCodeImage(code);

    try {
      await tweetWithImage(astuce);
    } catch (error) {
      console.log(
        "Error while posting tweet with image: ",
        (error as { message: string })?.message
      );
    }
  }
}

console.log("🚀 Cron process");
main();
// cron.schedule("0 * * * *", main);
