// lang/en/en.js
//
// Every user-facing string the server returns is declared exactly once
// here. "%1" placeholders are substituted by the handler classes in
// server.js before the string is sent in a response.
// AI was used in creating this

const MESSAGES = {
    GREETING_TEMPLATE: "Hello %1, What a beautiful day. Server current date and time is ",
    FILE_WRITE_SUCCESS: "Text appended to file.txt successfully.",
    FILE_NOT_FOUND_TEMPLATE: "404 Not Found: the file \"%1\" does not exist.",
    MISSING_NAME_PARAM: "Please provide a name using ?name=YourName in the URL.",
    MISSING_TEXT_PARAM: "Please provide text to append using ?text=YourText in the URL.",
    ROUTE_NOT_FOUND: "404 Not Found: no matching route for this URL."
};

module.exports = { MESSAGES };
