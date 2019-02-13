import * as express from 'express';
import * as pty from 'pty.js';

const app = express();
const expressWs = require('express-ws')(app);

console.log("Starting server")

// Instantiate shell and set up data handlers
expressWs.app.ws('/shell', (ws, req) => {
  console.log("GET: /shell")
  // Spawn the shell
  // Compliments of http://krasimirtsonev.com/blog/article/meet-evala-your-terminal-in-the-browser-extension
  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cwd: process.env.PWD,
    env: process.env
  });
  // For all shell data send it to the websocket
  shell.on('data', (data) => {
    ws.send(data);
  });
  // For all websocket data send it to the shell
  ws.on('message', (msg) => {
    shell.write(msg);
  });
});

// Start the application
app.listen(3000);

console.log("Running server on port 3000")
