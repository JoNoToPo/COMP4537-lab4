// modules/utils.js
//
// Part B. Encapsulates "what time is it on the server" behind a class so
// server.js never calls `new Date()` directly - it asks this service.
// ai was used in the creation of this server

class DateService {
    // Returns the server's current date/time as a string, e.g.
    // "Wed Oct 01 2026 12:52:14 GMT-0700 (Pacific Daylight Time)" -
    // exactly the format produced by JavaScript's built-in Date.toString().
    getCurrentDateString() {
        const now = new Date();
        return now.toString();
    }
}

module.exports = { DateService };
