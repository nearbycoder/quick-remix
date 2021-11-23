module.exports = {
  apps: [
    {
      name: 'Remix',
      script: 'npm run build && npm run start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
