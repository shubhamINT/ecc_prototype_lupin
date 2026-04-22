export default {
  apps: [
    {
      name: 'ecc-prototype-lupin',
      script: 'npm',
      args: 'run preview',
      cwd: '/home/shubham_halder/CODE/ecc_lupin_diognistics/ecc_prototype_lupin',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4173
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}