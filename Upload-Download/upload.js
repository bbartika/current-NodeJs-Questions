const http = require('http');
const fs = require('fs');
const path = require('path');

// File upload handler
function uploadFile(req, res) {
    const filePath = path.join(__dirname, 'uploaded-file.txt'); // Save the file as 'uploaded-file.txt'
    const writeStream = fs.createWriteStream(filePath);

    // Pipe the request stream to the write stream
    req.pipe(writeStream);

    // Handle the end of the stream
    req.on('end', () => {
        res.statusCode = 200;
        res.end('File uploaded successfully');
    });

    // Handle errors
    req.on('error', (err) => {
        console.error(err);
        res.statusCode = 500;
        res.end('Failed to upload file');
    });
}

// HTTP server for file uploading
const uploadServer = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/upload') {
        uploadFile(req, res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

uploadServer.listen(4000, () => {
    console.log('Upload server is listening on port 4000');
});
