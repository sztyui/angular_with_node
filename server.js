if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({path: './development.env'});
  console.log(process.env);
}

const app = require('./backend/app');
const debug = require('debug')('node-angular');
const http = require('http');

const normalizePort = val => {
  var port = parseInt(val, 10);
  if(isNaN(port)){
    return val;
  }

  if(port >= 0){
    return port;
  }

  return false;
}

const onError = error => {
  if (error.syscall != "listen"){
    throw error;
  }
  const bind = typeof addr === 'string' ? "pipe " + addr : "port " + port;
  switch(error.code){
    case "EACCESS":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  if(typeof addr === "string"){
    debug(`Listening on pipe ${addr}`);
  }
  else {
    debug(`Listening on http://localhost:${port}/`);
  }
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
