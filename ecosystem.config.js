module.exports = {
  apps: [
    {
      name: "ytfontend",
      script: "npx",
      args: "serve -s build -l 3000",
      cwd: "/var/www/html/ytfontend", // เปลี่ยน path นี้ให้ตรงกับที่เก็บ build จริง
      env: {
        NODE_ENV: "production"
      },
      error_file: "./logs/ytfontend-error.log",
      out_file: "./logs/ytfontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
