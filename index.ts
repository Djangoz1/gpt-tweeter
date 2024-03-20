import OpenAI from "openai";
import puppeteer from "puppeteer";

import fs from "fs";
import {
  //   download,
  //   getBearerToken,
  tweetWithImage,
  //   uploadMedia,
} from "./utils/tweeter";

require("dotenv").config();

async function generateCodeImage(code: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = `
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/default.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js"></script>
        <script>hljs.highlightAll();</script>
        <style>
          body { margin: 0; }
          pre.code-block { background-color: #f6f8fa; padding: 20px; } /* Appliquez un padding ici */
        </style>
      </head>
      <body>
        <pre class="code-block"><code class="javascript">${code}</code></pre>
      </body>
    </html>`;

  await page.setContent(htmlContent, {
    waitUntil: "domcontentloaded",
  });

  // Attendez que le script de mise en évidence soit terminé
  await page.waitForSelector("pre.code-block");

  // Sélectionnez l'élément et prenez une capture d'écran
  const codeBlock = await page.$("pre.code-block");
  if (!codeBlock) {
    throw new Error("Le bloc de code n'a pas été trouvé");
  }
  const screenshotBuffer = await codeBlock.screenshot();

  await browser.close();
  return screenshotBuffer;
}

// Utilisation de la fonction avec un exemple de code

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `"Tu es un assistant virtuel qui aide les développeurs à améliorer leurs compétences. Ton objectif est de présenter une astuce de programmation peu connue mais puissante pour les développeurs seniors. Choisis un des langages suivants : JS, React, TypeScript, Solidity, ou Tailwind. Présente une astuce qui offre une solution élégante à un problème commun, en expliquant brièvement le problème et comment l'astuce l'améliore. Termine par un exemple de code illustrant l'astuce en action. Utilise le format suivant pour structurer ta réponse, en incluant les marqueurs 'AstuceDébut' et 'AstuceFin' pour l'explication, et 'CodeDébut' et 'CodeFin' pour l'exemple de code. Assure-toi que ta réponse est concise pour s'adapter aux conventions sociales au sein de Twitter.

AstuceDébut
[Description de l'astuce et du problème résolu]
AstuceFin

CodeDébut
\`\`\`[langage]
[Insère ici l'exemple de code]
\`\`\`
CodeFin
"`,
        //   "Génère une astuce avancée et peu connue pour les développeurs expérimentés travaillant avec [Langage/Technologie, par exemple, Solidity]. Inclut un problème spécifique que cette astuce aide à résoudre, une explication détaillée de l'astuce elle-même, et un exemple de code démontrant son application. Assure-toi que l'exemple est concis mais complet, montrant clairement comment la mise en œuvre de l'astuce améliore le code ou le processus de développement, tout en adaptant ta réponse au convention social au sein de twitter.",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const responseText = completion.choices[0].message.content; // Assurez-vous d'obtenir le contenu de la réponse correctement
  //   const codeRegex = /```[a-zA-Z]+\n([\s\S]*?)\n```/; // Recherche le bloc de code
  if (responseText === null) {
    throw new Error("La réponse est vide");
  }
  const astucePattern = /AstuceDébut\n([\s\S]*?)\nAstuceFin/;
  const astuceMatch = responseText.match(astucePattern);
  const astuce = astuceMatch ? astuceMatch[1].trim() : "";

  const codePattern = /CodeDébut\n```[a-zA-Z]+\n([\s\S]*?)```\nCodeFin/;
  const codeMatch = responseText.match(codePattern);
  const code = codeMatch ? codeMatch[1].trim() : "";

  if (!code && !astuce) {
    throw new Error("La réponse est vide");
  } else {
    await generateCodeImage(code).then((screenshotBuffer) => {
      fs.writeFileSync("code-image.png", screenshotBuffer);
    });

    try {
      //   let token = await getBearerToken();
      //   console.log("! get token !", token);

      //   const mediaId = await uploadMedia("code-image.png", token);
      //   console.log("! get media id!");
      await tweetWithImage(astuce);
      console.log("Tweet publié avec succès!", { astuce });
    } catch (error) {
      console.log(
        "Error while posting tweet with image: ",
        (error as { message: string })?.message
      );
    }
  }
}

main();
