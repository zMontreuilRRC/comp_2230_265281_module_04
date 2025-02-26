const userFormNode = document.querySelector("#user-form");

userFormNode.addEventListener("submit", (eventObj) => {
    // stop the default behaviour of the form submit event
    // in this case, do not create a new HTTP request    
    eventObj.preventDefault();

    const validInputs = validateUserForm();

    if(validInputs) {
        userFormNode.submit();
    }
});

function validateUserForm() {
    let validInputs = true;

    // capture the values of the inputs
    const userNameInputNode = document.querySelector("#field_user-name");
    const userNameInputValue = userNameInputNode.value;

    return validInputs;
}