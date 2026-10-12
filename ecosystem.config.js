// pm2 config for production. Shipped inside every release by .github/workflows/deploy.yml
// and started by scripts/deploy/activate-release.sh.
const path = require('path')

const APP_DIR = process.env.APP_DIR || '/home/ubuntu/app/adigsi-web-and-cms'

module.exports = {
  apps: [
    {
      name: 'adigsi-web',
      // "current" is a symlink to the active release, so a reload always picks up the latest one
      cwd: path.join(APP_DIR, 'current'),
      script: 'server.js',
      node_args: `--env-file=${path.join(APP_DIR, 'shared', '.env.production')}`,
      // Single instance: instrumentation.ts runs the server stats timer once per process
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
}
