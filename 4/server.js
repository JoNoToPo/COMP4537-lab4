// modules/fileService.js
//
// Part C. Encapsulates all reading/writing of files on disk behind a
// class, with its own data directory so the server never reads or
// writes anywhere else on the filesystem.
// AI was used in creating this

const fs = require("fs");
const path = require("path");

class FileService {
    constructor(dataDirectory) {
        this.dataDirectory = dataDirectory;

        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory, { recursive: true });
        }
    }

    // path.basename() strips away any "../" or folder segments the user
    // might put in the URL, so a request can never escape dataDirectory.
    resolveSafePath(fileName) {
        const safeFileName = path.basename(fileName);
        return path.join(this.dataDirectory, safeFileName);
    }

    // Appends one line of text to fileName, creating the file first if
    // it does not already exist (fs.appendFileSync does this for us).
    appendLine(fileName, text) {
        const filePath = this.resolveSafePath(fileName);
        fs.appendFileSync(filePath, text + "\n", "utf8");
    }

    // Returns the file's full text content, or null if it doesn't exist.
    readFileContent(fileName) {
        const filePath = this.resolveSafePath(fileName);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        return fs.readFileSync(filePath, "utf8");
    }
}

module.exports = { FileService };
