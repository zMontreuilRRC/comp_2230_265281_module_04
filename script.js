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

function validateUserForm() {
    // clear all previous error messages
    const errorMessageNodes = document.querySelectorAll(".input-error");

    errorMessageNodes.forEach(n => n.remove());

    let inputsAreValid = true;

    // capture the values of the inputs
    // VALIDATE USERNAME
    const userNameInputNode = document.querySelector("#field_user-name");
    const userNameInputValue = userNameInputNode.value;

    // "Blacklist" method: prevent disallowed values from being added
    // cf. "Whitelist" method: allowing specific patterns of values
    const invalidChars = ["#", "$", "%"," ", "^", "*", "&"];

    if(userNameInputValue.trim().length < 4) {
        inputsAreValid = false;
        displayInputError(userNameInputNode, 
            "Username must be at least three characters."
        );
    }

    let invalidCharacterInput = false;
    invalidChars.forEach(c => {
        if(userNameInputValue.includes(c)) {
            invalidCharacterInput = true;
        }
    });

    if(invalidCharacterInput) {
        inputsAreValid = false;
        displayInputError(userNameInputNode, 
            `Characters ${invalidChars} not allowed.`
        );
    }

    // EMAIL VALIDATION
    const emailInputNode = document.querySelector("#field_email");
    const emailInputValue = emailInputNode.value;

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
    const emailFollowsPattern = emailPattern.test(emailInputValue);
    if(!emailFollowsPattern) {
        inputsAreValid = false;
        displayInputError(emailInputNode, 
            `Please provide a valid email.`
        );
    }

    return inputsAreValid;
}

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