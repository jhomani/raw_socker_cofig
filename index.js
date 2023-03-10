const WebSocketServer = require("websocket").server;
const express = require('express');
const http = require("http");

// const server = http.createServer(function (request, response) {
//   console.log(new Date() + " Received request for " + request.url);
//   response.writeHead(404);
//   response.end();
// });

const app = express();
const server = http.createServer(app);

server.listen(3015,  function () {
  console.log(new Date() + " Server is listening on port 3015");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections on production
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  console.log(origin);
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    // request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  // console.log(request);
  console.log('Num connections: ', wsServer.connections.length)
  const protocol = request.httpRequest.headers['sec-websocket-protocol']; 

  console.log(protocol);

  const connection = request.accept(protocol, request.origin);
  // const connection = request.accept("echo-protocol", request.origin);

  console.log(new Date() + " Connection accepted.");


  connection.on("message", (message) => {
    // wsServer.broadcastUTF(message.utf8Data); 
    console.log(wsServer);

    wsServer.emit('Ramdowm message', 'SOME THIS WITH EMIT');

    // if (message.type === "utf8") {
    //   console.log("Received Message: " + message.utf8Data);
    //   connection.sendUTF(message.utf8Data);
    // } else if (message.type === "binary") {
    //   console.log(
    //     "Received Binary Message of " + message.binaryData.length + " bytes"
    //   );
    //   connection.sendBytes(message.binaryData);
    // }
  });

  connection.on("close", (reasonCode, description) => {
    console.log(new Date() + " Peer " + connection.remoteAddress + " disconnected.");
  });

});
