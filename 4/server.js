// server.js
//
// Parts B and C. A plain Node.js HTTP server - no Express or any other
// framework, per the lab's requirement. Everything lives in a class
// except the handful of lines at the very bottom that wire the classes
// together and start listening (the "starter").
// ai was used in the creation of this server

const http = require("http");
const path = require("path");

const { DateService } = require("./modules/utils.js");
const { FileService } = require("./modules/fileService.js");
const { MESSAGES } = require("./lang/en/en.js");

// Handles GET .../getDate/?name=John
class GetDateHandler {
    constructor(dateService) {
        this.dateService = dateService;
    }

    handle(req, res, routeMatch, queryParams) {
        const name = queryParams.get("name");

        if (!name) {
            res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(MESSAGES.MISSING_NAME_PARAM);
            return;
        }

        const currentDateString = this.dateService.getCurrentDateString();
        const greetingText = MESSAGES.GREETING_TEMPLATE.replace("%1", this.escapeHtml(name)) + currentDateString;

        // Inline styling, applied on the server, so the blue color is
        // part of the HTML response itself - not added by the client.
        const responseBody = `<span style="color: blue;">${greetingText}</span>`;

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(responseBody);
    }

    escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

// Handles GET .../writeFile/?text=BCIT
class WriteFileHandler {
    constructor(fileService, targetFileName) {
        this.fileService = fileService;
        this.targetFileName = targetFileName;
    }

    handle(req, res, routeMatch, queryParams) {
        const text = queryParams.get("text");

        if (!text) {
            res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(MESSAGES.MISSING_TEXT_PARAM);
            return;
        }

        this.fileService.appendLine(this.targetFileName, text);

        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(MESSAGES.FILE_WRITE_SUCCESS);
    }
}

// Handles GET .../readFile/<fileName>
class ReadFileHandler {
    constructor(fileService) {
        this.fileService = fileService;
    }

    handle(req, res, routeMatch) {
        const requestedFileName = decodeURIComponent(routeMatch[1]);
        const fileContent = this.fileService.readFileContent(requestedFileName);

        if (fileContent === null) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(MESSAGES.FILE_NOT_FOUND_TEMPLATE.replace("%1", requestedFileName));
            return;
        }

        // text/plain so the browser displays the content directly
        // instead of downloading it.
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(fileContent);
    }
}

// Matches the incoming request's method + path against a list of
// registered routes and hands off to that route's handler.
class Router {
    constructor() {
        this.routeDefinitions = [];
    }

    addRoute(method, pathPattern, handler) {
        this.routeDefinitions.push({ method, pathPattern, handler });
    }

    route(req, res) {
        const requestUrl = new URL(req.url, `http://${req.headers.host}`);

        for (const routeDefinition of this.routeDefinitions) {
            if (req.method !== routeDefinition.method) {
                continue;
            }

            const routeMatch = requestUrl.pathname.match(routeDefinition.pathPattern);
            if (routeMatch) {
                routeDefinition.handler.handle(req, res, routeMatch, requestUrl.searchParams);
                return;
            }
        }

        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(MESSAGES.ROUTE_NOT_FOUND);
    }
}

// Owns the raw http.Server instance and starts it listening.
class HttpServerApp {
    constructor(port, router) {
        this.port = port;
        this.router = router;
        this.server = http.createServer((req, res) => this.router.route(req, res));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}

// --- Starting point of the program (intentionally outside any class) ---
const PORT = process.env.PORT || 3000;
const DATA_DIRECTORY = path.join(__dirname, "data");
const WRITE_FILE_NAME = "file.txt";

const dateService = new DateService();
const fileService = new FileService(DATA_DIRECTORY);

const router = new Router();
router.addRoute("GET", /^\/COMP4537\/labs\/3\/getDate\/?$/, new GetDateHandler(dateService));
router.addRoute("GET", /^\/COMP4537\/labs\/3\/writeFile\/?$/, new WriteFileHandler(fileService, WRITE_FILE_NAME));
router.addRoute("GET", /^\/COMP4537\/labs\/3\/readFile\/(.+)$/, new ReadFileHandler(fileService));

const serverApp = new HttpServerApp(PORT, router);
serverApp.start();
