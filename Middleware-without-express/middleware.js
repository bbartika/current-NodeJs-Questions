const http = require('http');
const fs = require('fs');
const path = require('path');

// Middleware to log each request
function loggerMiddleware(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next(); // Proceed to the next middleware or request handler
}

// Middleware to parse JSON body
function jsonBodyParser(req, res, next) {
    if (req.headers['content-type'] === 'application/json') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                req.body = JSON.parse(body);
                next();
            } catch (err) {
                res.statusCode = 400;
                res.end('Invalid JSON');
            }
        });
    } else {
        next();
    }
}

// Custom middleware handler function to apply middlewares
function applyMiddlewares(req, res, middlewares, finalHandler) {
    let i = 0;
    
    // Function to execute the next middleware or final handler
    function next() {
        if (i < middlewares.length) {
            const middleware = middlewares[i];
            i++;
            middleware(req, res, next); // Call middleware and pass 'next' to move to the next one
        } else {
            finalHandler(req, res); // If no more middleware, proceed to the final handler
        }
    }
    
    next(); // Start middleware chain
}

// Example request handler (acts like a route handler)
function requestHandler(req, res) {
    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Hello, World!' }));
    } else if (req.url === '/upload' && req.method === 'POST') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'File uploaded', body: req.body }));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    const middlewares = [loggerMiddleware, jsonBodyParser];

    // Apply middlewares and then handle the request
    applyMiddlewares(req, res, middlewares, requestHandler);
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});







//Simplified Code
const http = require('http');

// Middleware: Logs the method and URL of incoming requests
function loggerMiddleware(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next(); // Call next middleware or route handler
}


// Request handler (like a route handler)
function requestHandler(req, res) {
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello, World!');
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

// Middleware handler
function applyMiddlewares(req, res, middlewares, finalHandler) {
    let i = 0;
    
    function next() {
        if (i < middlewares.length) {
            const middleware = middlewares[i];
            i++;
            middleware(req, res, next); // Call middleware and pass control to the next one
        } else {
            finalHandler(req, res); // If no more middleware, handle the request
        }
    }
    
    next(); // Start the middleware chain
}

// Create the server
const server = http.createServer((req, res) => {
    const middlewares = [loggerMiddleware];
    applyMiddlewares(req, res, middlewares, requestHandler);
});

// Start the server
server.listen(7000, () => {
    console.log('Server running at http://localhost:7000/');
});
