import fs from 'fs';
import path from 'path';
import { createServer } from 'https';
import next from 'next';

// Set environment mode (development or production)
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Path to your mkcert certificate files
const httpsOptions = {
  key: fs.readFileSync(path.join('/home/thedeath/Desktop/', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join('/home/thedeath/Desktop/', 'localhost.pem')),
};

// Prepare the Next.js app and start the HTTPS server
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, () => {
    console.log('> Server is running on https://localhost:3000');
  });
});