const responseHandler = require('../utils/responseHandler');
const regexPatterns = require('./regex');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const logger = require('../utils/logger');

// Common validation function
const validateField = (field, regex, errorMessage) => {
    return field && regex.test(field) ? null : errorMessage;
};

// Signup validation middleware
const validateUser = (req, res, next) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
        console.log(` name: ${name} \n email: ${email} \n phone: ${phone} \n password: ${password} \n confirmPassword: ${confirmPassword}`.bgGreen);
        logger.warn(`Signup failed: Required field are missing`);
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS);
    }

    const errors = [];

    errors.push(validateField(name, regexPatterns.name, MESSAGE.VALIDATION.NAME));
    errors.push(validateField(email, regexPatterns.email, MESSAGE.VALIDATION.EMAIL));
    errors.push(validateField(phone, regexPatterns.phone, MESSAGE.VALIDATION.PHONE));
    errors.push(validateField(password, regexPatterns.password, MESSAGE.VALIDATION.PASSWORD));

    const filteredErrors = errors.filter(error => error);

    if (filteredErrors.length > 0) {
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, filteredErrors[0], null);
    }

    next();
};

// Login validation middleware
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn('Login failed: Required fields are missing');
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS);
    }

    if (!regexPatterns.email.test(email)) {
        logger.warn(`Login failed: Invalid email format for ${email}`);
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.VALIDATION.EMAIL);
    }

    next();
};

// User update validation middleware
const validateUpdateUser = (req, res, next) => {
    const { name, email, phone, password } = req.body;

    const fieldsToValidate = {
        name: { value: name, pattern: regexPatterns.name, message: MESSAGE.VALIDATION.NAME },
        email: { value: email, pattern: regexPatterns.email, message: MESSAGE.VALIDATION.EMAIL },
        phone: { value: phone, pattern: regexPatterns.phone, message: MESSAGE.VALIDATION.PHONE },
        password: { value: password, pattern: regexPatterns.password, message: MESSAGE.VALIDATION.PASSWORD }
    };

    const errors = Object.entries(fieldsToValidate)
        .map(([key, { value, pattern, message }]) => value ? validateField(value, pattern, message) : null)
        .filter(error => error);

    if (errors.length > 0) {
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, errors[0], null);
    }

    next();
};

// Menu item validation middleware
const validateMenu = (req, res, next) => {
    const { name, description, price, category } = req.body;

    if (!name || price === undefined || !category) {
        logger.warn(`Menu item creation failed: Required fields are missing`);
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS);
    }

    const errors = [];

    errors.push(validateField(name, regexPatterns.name, MESSAGE.VALIDATION.NAME));
    if (description) {
        errors.push(validateField(description, regexPatterns.description, MESSAGE.VALIDATION.DESCRIPTION));
    }
    errors.push(validateField(price, regexPatterns.price, MESSAGE.VALIDATION.PRICE));
    errors.push(validateField(category, regexPatterns.category, MESSAGE.VALIDATION.CATEGORY));

    const filteredErrors = errors.filter(error => error);

    if (filteredErrors.length > 0) {
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, filteredErrors[0]);
    }

    next();
};

// Menu item update validation middleware
const validateUpdateMenu = (req, res, next) => {
    const { name, description, price, category } = req.body;

    const fieldsToValidate = {
        name: { value: name, pattern: regexPatterns.name, message: MESSAGE.VALIDATION.NAME },
        description: { value: description, pattern: regexPatterns.description, message: MESSAGE.VALIDATION.DESCRIPTION },
        price: { value: price, pattern: regexPatterns.price, message: MESSAGE.VALIDATION.PRICE },
        category: { value: category, pattern: regexPatterns.category, message: MESSAGE.VALIDATION.CATEGORY }
    };

    const errors = Object.entries(fieldsToValidate)
        .map(([key, { value, pattern, message }]) => value ? validateField(value, pattern, message) : null)
        .filter(error => error);

    if (errors.length > 0) {
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, errors[0]);
    }

    next();
};

// Validate category fields
const validateCategory = (req, res, next) => {
    const { name, description } = req.body;

    if (!name) {
        logger.warn('Category creation failed: Name is required');
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS);
    }

    // Additional validation can be added as needed
    const errors = [];

    if (description && !regexPatterns.description.test(description)) {
        errors.push(MESSAGE.VALIDATION.DESCRIPTION); // Add your description validation
    }

    if (errors.length > 0) {
        return responseHandler(res, STATUS_CODE.BAD_REQUEST, errors[0], null);
    }

    next();
};


module.exports = {
    validateUser,
    validateLogin,
    validateUpdateUser,
    validateMenu,
    validateUpdateMenu,
    validateCategory,
};
