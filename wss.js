import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received:', JSON.parse(data.toString()));
    ws.send(data.toString())
  });

  ws.send('something');
});