import OpenAI from "openai";
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
let languageIndex = 0;
let languages = ["Solidity", "JS", "React", "TypeScript", "Tailwind"];
let prompt = `"Tu es un assistant virtuel qui aide les développeurs à améliorer leurs compétences. Ton objectif est de présenter une astuce de programmation peu connue mais puissante pour les développeurs seniors. Le language en question est ["Solidity", "JS", "React", "TypeScript", "Tailwind"]. À chaque requête, présente une nouvelle astuce qui offre une solution élégante à un problème commun, en expliquant brièvement le problème et comment l'astuce l'améliore. L'astuce doit faire 280 caractères au maximum et évite de répéter les astuces déjà suggérées. Termine par un exemple de code illustrant l'astuce en action. Utilise le format suivant pour structurer ta réponse, en incluant les marqueurs 'AstuceDébut' et 'AstuceFin' pour l'explication, et 'CodeDébut' et 'CodeFin' pour l'exemple de code. Assure-toi que ta réponse est concise pour s'adapter aux conventions sociales au sein de Twitter.

AstuceDébut
[Description de l'astuce et du problème résolu. 280 caractères max.]
AstuceFin

CodeDébut
\`\`\`[langage]
[Insère ici l'exemple de code]
\`\`\`
CodeFin
"`;
export const openAiRequest = async () => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.9,
      top_p: 0.8,
      model: "gpt-3.5-turbo",
    });

    const responseText = completion.choices[0].message.content; // Assurez-vous d'obtenir le contenu de la réponse correctement

    if (responseText === null) {
      throw new Error("La réponse est vide");
    }
    const astucePattern = /AstuceDébut\n([\s\S]*?)\nAstuceFin/;
    const astuceMatch = responseText.match(astucePattern);
    const astuce = astuceMatch ? astuceMatch[1].trim() : "";

    const codePattern = /CodeDébut\n```[a-zA-Z]+\n([\s\S]*?)```\nCodeFin/;
    const codeMatch = responseText.match(codePattern);
    const code = codeMatch ? codeMatch[1].trim() : "";

    if (!code || !astuce || astuce.length > 280) {
      throw new Error("La réponse est invalide");
    }

    if (languageIndex < languages.length - 1) {
      languageIndex++;
    } else {
      languageIndex = 0;
    }
    console.log("🚀 Astuce created with ", astuce.length, " characters");
    return { astuce, code };
  } catch (error) {
    console.log("Error while requesting OpenAI: ", error);
    return null;
  }
};
