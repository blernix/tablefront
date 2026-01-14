module.exports = {
  apps: [{
    name: 'tablemaster-frontend',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3030
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3030
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', '.next', 'logs', '.git', 'public'],
    restart_delay: 5000,
    max_restarts: 10
  }]
};
