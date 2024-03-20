import fs from "fs";
import puppeteer from "puppeteer";

require("dotenv").config();
/**
 * @notice Puppeter viens génèrer directement une image à code-image.png
 * Il faut donc créer une page pour qu'il puisse y accéder
 * @param {string} code. Le code que vous souhaitez capturé en image
 */
export const generateCodeImage = async (code: string) => {
  try {
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
    await fs.writeFileSync("code-image.png", screenshotBuffer);

    console.log("🚀 screenshot done !");
    return screenshotBuffer;
  } catch (error) {
    console.log("Error while generating code image: ", error);
  }
};
