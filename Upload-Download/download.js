// File download handler
function downloadFile(req, res) {
    const filePath = path.join(__dirname, 'uploaded-file.txt');

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end('File not found');
            return;
        }

        const readStream = fs.createReadStream(filePath);

        // Set headers for download
        res.setHeader('Content-Disposition', 'attachment; filename="downloaded-file.txt"');
        res.setHeader('Content-Type', 'application/octet-stream');

        // Pipe the read stream to the response
        readStream.pipe(res);

        // Handle errors
        readStream.on('error', (err) => {
            console.error(err);
            res.statusCode = 500;
            res.end('Failed to download file');
        });
    });
}

// HTTP server for file downloading
const downloadServer = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/download') {
        downloadFile(req, res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

downloadServer.listen(5000, () => {
    console.log('Download server is listening on port 5000');
});
