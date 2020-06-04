const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

console.log('Server started');

server.on('open', function open() {
  console.log('connected');
});

server.on('close', function close() {
  console.log('disconnected');
});

server.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;
  const port = req.connection.remotePort;
  const clientName = ip + port;

  console.log('New connection: %s is connected', clientName)

  // 发送欢迎信息给客户端
  //ws.send("Welcome " + clientName);

  ws.on('message', function incoming(message) {
      var jmsg = JSON.parse(message);
      switch(jmsg.type){
          case "Queue":
            var iname = jmsg.name;
            var iS = jmsg.Supra;
            var iS1 = jmsg.S1;
            var iS2 = jmsg.S2;
      console.log('Join: %s from %s', iname, clientName);
            break;
          case "Del":
            var dname = jmsg.name;
            var dtime = jmsg.time;
      console.log('Delete: %s from %s', dname, clientName);
            break;
        }
    
    // 广播消息给所有客户端
    server.clients.forEach(function each(client) {
        var now = new Date();
        var chour = now.getHours();
        var cmin = now.getMinutes();
        var csec = now.getSeconds();
        var TimeNow = chour + ":" + cmin + ":" + csec; 
      if (client.readyState === WebSocket.OPEN) {
          switch(jmsg.type){
              case "Queue":
                var msg = {
                    type: "Boardcast",
                    name: iname,
                    Supra: iS,
                    S1: iS1,
                    S2: iS2,
                    Time: TimeNow
                    }
                    break;
                    
              case "Del":
                var msg = {
                    type: "DelQ",
                    name: dname,
                    time: dtime
                    }
                    break;
          }
		client.send(JSON.stringify(msg));
        //client.send( clientName + " -> " + msg);
      }
    });

  });

});