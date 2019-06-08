module.exports = {
  apps : [{
    name: 'eCommerce API',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 2,
    autorestart: true,
    watch: ['.', './controllers', './repositories', './validators'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:gboyegadada/ecommerce-api.git',
      path : '/var/www/production',
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env production'
    }
  }
};
