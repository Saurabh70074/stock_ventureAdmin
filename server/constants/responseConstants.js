const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1,
};

const HTTP_STATUS_CODES = {
    SUCCESS: 200,
    BAD_REQUEST : 400,
    NOT_FOUND : 404,
    INTERNAL_SERVER : 500,
}

const MESSAGES = {
    EMPTY: {},
    KEY_CANT_EMPTY: "{{key}} cannot be empty",
    EMAIL_EXIST: "Email already exist!",
    INTERNAL_SERVER_ERROR: 'Something went wrong.',
    EMAIL_OR_PHONE_NUMBER_EXIST: "Email or phone number already exist!",
    EMAIL_OR_PHONE_NUMBER_NOT_EXIST: "Email or phone number does not exist!",
    PASSWORD_INCORRECT : "Password is incorrect",
    NO_TOKEN_SUPPLIED : "accessToken is required"
}

module.exports = Object.freeze({
    STATUS_CODE,
    MESSAGES,
    HTTP_STATUS_CODES
})