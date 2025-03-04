const userFormNode = document.querySelector("#user-form");

userFormNode.addEventListener("submit", (eventObj) => {
    // stop the default behaviour of the form submit event
    // in this case, do not create a new HTTP request    
    eventObj.preventDefault();

    const inputsAreValid = validateUserForm();

    if(inputsAreValid) {
        userFormNode.submit();
    } else {
        console.warn("Invalid inputs");
    }
});

/**
 * Removes any error messages from form, collects form inputs, and validates them.
 * Invokes @function displayInputError to insert error messages
 * @returns {Boolean} True if no validation errors are found
 */
function validateUserForm() {
    // we will divide these functions so that validateUserForm() interacts with the DOM
    // each validation function will only return if the input is valid and any error messages
    // clear all previous error messages
    const errorMessageNodes = document.querySelectorAll(".input-error");

    errorMessageNodes.forEach(n => n.remove());

    let inputsAreValid = true;

    // capture the values of the inputs
    // VALIDATE USERNAME
    const userNameInputNode = document.querySelector("#field_user-name");
    const userNameInputValue = escapeHTML(userNameInputNode.value);

    // returns if user name is valid
    // has side effect of displaying error if the username is invalid
    const userNameValidation = validateUserName(userNameInputValue, userNameInputNode);
    inputsAreValid = userNameValidation["isValid"];

    if(userNameValidation["errorMessages"].length > 0) {
        userNameValidation["errorMessages"].forEach(m => {
            displayInputError(userNameInputNode, m)
        });
    }

    // EMAIL VALIDATION
    const emailInputNode = document.querySelector("#field_email");
    const emailInputValue = escapeHTML(emailInputNode.value);

    // return true if email is valid
    // as side effect, display error message at input node
    const emailValidation = validateEmail(emailInputValue, emailInputNode);
    inputsAreValid = emailValidation["isValid"];

    if(emailValidation["errorMessages"].length > 0) {
        emailValidation["errorMessages"].forEach(m => {
            displayInputError(emailInputNode, m)
        });
    }

    return inputsAreValid;
}

/**
 * Validates a string to check for invalid characters and length
 * @param {string} input - The value in the username field 
 * @returns {Object}  the validation state
 * @returns {Boolean} "isValid" - if all validations are correct
 * @returns {String[]} "errorMessages" - errors found in validation 
 */
function validateUserName(input) {
    let validUsername = true;
    const errorMessages = [];
    const invalidChars = ["#", "$", "%"," ", "^", "*", "&"];

    if(input.trim().length < 4) {
        validUsername = false;
        errorMessages.push("Username must be at least three characters.");
    }

    let invalidCharacterInput = false;
    invalidChars.forEach(c => {
        if(input.includes(c)) {
            invalidCharacterInput = true;
        }
    });

    if(invalidCharacterInput) {
        validUsername = false;
        errorMessages.push(`Characters ${invalidChars} not allowed.`);
    }

    return {
        isValid: validUsername, 
        errorMessages: errorMessages
    };
}

/**
 * Validates a string to check for email pattern compliance
 * @param {string} input - The value in the email field 
 * @returns {Object} the validation state
 * @returns {Boolean} "isValid" - if all validations are correct
 * @returns {String[]} "errorMessages" - errors found in validation 
 */
function validateEmail(input) {
    let validEmail = true;
    const errorMessages = [];

    // simple regex pattern: characters with an @ and a . between the
    // '.+': one or more of any character (except line breaks)
    // '@': literal '@' character
    // '\.': literal '.' character
    // const emailPattern = /.+@.+\..+/;

    /**  more robust email pattern
    * ^ and $: string must begin and end with this pattern
    * [A-Z0-9._%+-]+: Allow one or more characters that fall within the [] 
    *   (In this case, we want all alphabetic, numeric, and ._%+- characters)
    * @: '@' character literal
    * \.: '\.' character literal
    * /i: case-insensitive flag
    * [A-Z]{2,4}: any alphabetic character between 2 and 4 (inclusive) times
    */

    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i; 

    // test the email against the pattern
    const emailFollowsPattern = emailPattern.test(input);
    if(!emailFollowsPattern) {
        validEmail = false;
        errorMessages.push("Please provide a valid email");
    }

    return {isValid: validEmail, errorMessages: errorMessages};
}

/**
 * Appends error message node to parent node of field
 * @param {HTMLElement} inputElement - the node of the field with a validation error
 * @param {String} message - the text to be appended 
 */
function displayInputError(inputElement, message) {
    // get the closest ancestor of the input element with the argument selector
    const inputParentNode = inputElement.closest(".input-container");
    const errorDisplayNode = document.createElement("span");
    errorDisplayNode.textContent = message;
    errorDisplayNode.classList.add("input-error");

    // add aria role for alerts because HTML has no "alert" semantic element
    errorDisplayNode.setAttribute("role", "alert");

    inputParentNode.appendChild(errorDisplayNode);
}

/**
 * Replace special HTML-relevant characters with HTML entities
 * This replacement pattern found in RRC Front-End Development module 4 lecture notes
 * @param {String} input - the value to be sanitized
 * @returns {String} - input with relevant characters replaced with HTML entities 
 */
function escapeHTML(input) {
    // for example, "<div>" is returned as &quot;&lt;div&gt;&quot;
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}