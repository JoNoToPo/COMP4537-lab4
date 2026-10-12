const http = require("http");

const PORT = process.env.PORT || 3000;
console.log("BOOT TEST: about to start listening on port", PORT);

const server = http.createServer((req, res) => {
    res.end("Boot test OK");
});

server.listen(PORT, () => {
    console.log("BOOT TEST: now listening on port", PORT);
});