const httpServer = require('http-server');

const server = httpServer.createServer({ root: __dirname });
const port = process.env.PORT || 8082;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
