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

app.get('/', function (req, res) {
  res.send('Hello World')
})

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
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);

      // connection.

      wsServer.broadcastUTF({data: "for you"});
      // connection.sendUTF(message.utf8Data);
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
