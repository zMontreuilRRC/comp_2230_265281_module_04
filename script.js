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
    let inputsAreValid = true;

    // capture the values of the inputs
    // VALIDATE USERNAME
    const userNameInputNode = document.querySelector("#field_user-name");
    const userNameInputValue = userNameInputNode.value;

    // "Blacklist" method: prevent disallowed values from being added
    // cf. "Whitelist" method: allowing specific patterns of values
    const invalidChars = ["#", "$", "%", "^", "*", "&", " "];

    if(userNameInputValue.trim().length < 4) {
        inputsAreValid = false;
    }

    invalidChars.forEach(c => {
        if(userNameInputValue.includes(c)) {
            inputsAreValid = false;
        }
    });

    return inputsAreValid;
}