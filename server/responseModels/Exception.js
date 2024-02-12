class Exception {
    constructor(errorCode, message, errorStackTrace) {
        this.errorCode = errorCode;
        if (message && message.message) {
            message = message.message;
        }
        this.errorMessage = message;
        if (errorStackTrace) {
            this.errors = errorStackTrace;
        }
    }
}

// ========================== Export Module Start ==========================
module.exports = Exception;
// ========================== Export Module End ============================