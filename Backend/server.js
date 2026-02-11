const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Start the server and listen on the specified port
server.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});