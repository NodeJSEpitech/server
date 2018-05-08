const middleware = require('../middleware/comment'),
    controller = require('../controller/comment'),
    {status, messages} = require('../../config/variables'),
    clients = [];

function handleConnection(ws) {
    const welcome = {
        'status': status.nc,
        'message': messages.success.welcome.unauth
    };
    clients.push(ws);
    ws.on('message', (message) => {
        const request = middleware.handleMessage(message);
        if (request.error) {
            controller.handleError(ws);
        } else {
            controller.handleRequest(ws, request, clients);
        }
    });
    ws.on('close', () => {
        for (const client in clients) {
            if (clients[client] === ws) {
                clients.splice(client, 1);
            }
        }
    });
    ws.send(JSON.stringify(welcome));
}

module.exports = {
    'handleConnection': handleConnection
};
