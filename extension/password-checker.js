let PASSWORD_LENGTH = 12;
let COMMON_SEQUENCES = ['qwerty', 'asdf', 'zxcvb', 'jkl;', '123', '1234', '123456'];
const password = document.getElementById('password-input');

// load common passwords from file
let commonPswds;
fetch('commonPasswords.txt')
    .then(response => response.text())
    .then(text => commonPswds = text.split(/\r?\n/));

// add onclick to eye icon
const togglePassword = document.getElementById('toggle-password');
togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');

    // todo: add icon for autofill and add following code for onclick (right now does it if click eye icon so like need to move it
    // todo: but also first decide if we even want to do this idk how to like handle if it doesn't work hah...every site is different
    // - on some sites, won't show up when toggled to reveal password (twitter)
    // - also requires we have access to every page user is on which could be seen as invasive
    // todo: only works if password not being shown on site (bc checking against input type = password)
    let autofillPswd = "securibeePassword = " + JSON.stringify(password.value) +  ";";
    // autofill += "inputs = document.querySelectorAll('input');"
    // autofill += "for (let i = 0; i < inputs.length; i++) {if (inputs[i].getAttribute('type') === 'password') {inputs[i].value = securibeePassword;}}";
    chrome.tabs.executeScript(null, {
        code:  `${autofillPswd} (${autofill})()`
    });
});

function autofill() {
    // let securibeePassword = password.value;
    let inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute('type') === 'password') {
            inputs[i].value = securibeePassword;
        }
    }
}



window.onload = function() {
    // add onclick to drop downs
    dropdownOnClick();

    // password checker functionality
    let passwordChecker = document.getElementById("password-input");
    passwordChecker.oninput = function () {
        // console.log(passwordChecker.value);
        validatePassword();
    };

    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //
    //     // since only one tab should be active and in the current window at once
    //     // the return variable should only have one entry
    //     var activeTab = tabs[0];
    //     var activeTabId = activeTab.id; // or do whatever you need
    //     chrome.tabs.executeScript(activeTabId, {
    //         code: `(${modifyDOM})()`
    //     });
    // });
};

// validate password input
function validatePassword() {
    if (!passwordEmpty(password.value)) {
        checkLength(password.value);
        commonSequence(password.value);
        commonPasswords(password.value);
        containsNumber(password.value);
        containsSymbol(password.value);
        noSameLetterSequences(password.value);
        checkCase(password.value);
    }
}

// Check the length of the password
function checkLength(password) {
    // Check length
    if (password.length < PASSWORD_LENGTH) {
        document.getElementById("password-length").style.color = "#ab2000";
    } else {
        document.getElementById("password-length").style.color = "#108c00";
    }
}

// Check to see if any common sequences are in the password
function commonSequence(password) {
    // Check common sequences
    document.getElementById("password-common").style.color = "#108c00";
    let matchedSeqs = "";   // common sequences detected
    for (let i = 0; i < COMMON_SEQUENCES.length; i++) {
        // If common sequence detected, change color and append sequence to matchedSeqs for user feedback
        if (password.includes(COMMON_SEQUENCES[i])) {
            document.getElementById("password-common").style.color = "#ab2000";
            matchedSeqs = matchedSeqs.length === 0 ? "(" + COMMON_SEQUENCES[i] : matchedSeqs + ", " + COMMON_SEQUENCES[i];
        }
    }
    if (matchedSeqs.length !== 0) {
        matchedSeqs += ")";
    }
    document.querySelector("#password-common span").innerHTML = matchedSeqs;
}

// Check to see if any common sequences are in the password
function commonPasswords(password) {
    console.log(commonPswds);
    // Check common sequences
    document.getElementById("common-password-warning").style.display = "none";
    let matchedPasswords = "";   // common sequences detected
    for (let i = 0; i < commonPswds.length; i++) {
        // If common sequence detected, change color and append sequence to matchedSeqs for user feedback
        if (password.includes(commonPswds[i])) {
            document.getElementById("common-password-warning").style.display = "flex";
            matchedPasswords = matchedPasswords.length === 0 ? ": " + commonPswds[i] : matchedPasswords + ", " + commonPswds[i];
        }
    }
    // if (matchedPasswords.length !== 0) {
    //     matchedSeqs += ")";
    // }
    document.querySelector("#common-password-warning span").innerHTML = matchedPasswords;
}


// Check that there is one upper and lowercase letter in the password
function checkCase(password) {
    if (new RegExp('[a-z]+').test(password) && new RegExp('[A-Z]+').test(password)) {
        document.getElementById("password-case").style.color = "#108c00";
    } else {
        document.getElementById("password-case").style.color = "#ab2000";
    }
}

// Contains at least one number in the password
function containsNumber(password) {
    if (new RegExp('[0-9]+').test(password)) {
        document.getElementById("password-numbers").style.color = "#108c00";
    } else {
        document.getElementById("password-numbers").style.color = "#ab2000";
    }
}

// Contains at least one special character in the password
function containsSymbol(password) {
    if (new RegExp('[^A-Za-z0-9]').test(password)) {
        document.getElementById("password-special").style.color = "#108c00";
    } else {
        document.getElementById("password-special").style.color = "#ab2000";
    }
}

// No consecutive characters
function noSameLetterSequences(password) {
    if (new RegExp('(.)\\1+').test(password)) {
        document.getElementById("password-sequences").style.color = "#ab2000";
    } else {
        document.getElementById("password-sequences").style.color = "#108c00";
    }
}

// If the password is empty
function passwordEmpty(password) {
    if (password === "") {
        let passwordRequirements = document.querySelectorAll("#password-requirements *");
        // Make all of the texts
        for (let i = 0; i < passwordRequirements.length; i++) {
            passwordRequirements[i].style.color = "black";
        }
        document.querySelector("#password-common span").style.color = "#ab2000";
        return true;
    }
    return false;
}






