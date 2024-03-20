module.exports = {
  apps: [
    {
      name: "cron-job", // Nom de la première application
      script: "node_modules/.bin/ts-node",
      args: "./index.ts", // Chemin vers le premier script TypeScript
      interpreter: "none",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
