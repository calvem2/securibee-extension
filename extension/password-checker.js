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
});

window.onload = function() {
    // add onclick to drop downs
    dropdownOnClick();

    // password checker functionality
    let passwordChecker = document.getElementById("password-input");
    passwordChecker.oninput = function () {
        console.log(passwordChecker.value);
        validatePassword();
    };
};

// validate password input
function validatePassword() {
    password.value = disallowEmojis(password.value);
    if (!passwordEmpty(password.value)) {
        checkLength(password.value);
        commonSequence(password.value);
        commonPasswords(password.value);
        containsNumber(password.value);
        containsSymbol(password.value);
        noSameLetterSequences(password.value);
        checkCase(password.value);
        isASCII(password.value);
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
        document.querySelector("#password-common #sequences").style.color = "#ab2000";
        // Get rid of the warning popup
        document.getElementById("common-password-warning").style.display = "none";
        // Get rid of the error popup
        document.getElementById("common-password-error").style.display = "none";
        // Reset common sequences
        document.querySelector("#password-common #sequences").innerHTML = "";
        document.getElementById("password-requirements").classList.toggle("fa-ul", false);
        return true;
    }
    document.getElementById("password-requirements").classList.toggle("fa-ul", true);
    return false;
}

// Update the style of the bullets
function updateBulletStyle(id, isGreen) {
    let bulletID = "#" + id + " i";
    if (isGreen) { // green
        document.querySelector(bulletID).classList.toggle("fa-times", false);
        document.querySelector(bulletID).classList.toggle("fa-check", true);
        document.querySelector(bulletID).style.color = "#108c00";
        document.getElementById(id).style.color = "#108c00";
    } else { // red
        document.querySelector(bulletID).classList.toggle("fa-check", false);
        document.querySelector(bulletID).classList.toggle("fa-times", true);
        document.querySelector(bulletID).style.color = "#ab2000";
        document.getElementById(id).style.color = "#ab2000";
    }
}

// Check the length of the password
function checkLength(password) {
    // Check length
    if (password.length < PASSWORD_LENGTH) {
        updateBulletStyle("password-length", false);
    } else {
        updateBulletStyle("password-length", true);
    }
}

// Check to see if any common sequences are in the password
function commonSequence(password) {
    // Check common sequences
    updateBulletStyle("password-common", true);
    let matchedSeqs = "";   // common sequences detected
    for (let i = 0; i < COMMON_SEQUENCES.length; i++) {
        // If common sequence detected, change color and append sequence to matchedSeqs for user feedback
        if (password.includes(COMMON_SEQUENCES[i])) {
            updateBulletStyle("password-common", false);
            matchedSeqs = matchedSeqs.length === 0 ? "(" + COMMON_SEQUENCES[i] : matchedSeqs + ", " + COMMON_SEQUENCES[i];
        }
    }
    if (matchedSeqs.length !== 0) {
        matchedSeqs += ")";
    }
    document.querySelector("#password-common #sequences").innerHTML = matchedSeqs;
}

// Check to see if any common sequences are in the password
function commonPasswords(password) {
    // Check common sequences
    document.getElementById("common-password-warning").style.display = "none";
    let matchedPasswords = "";   // common sequences detected
    for (let i = 0; i < commonPswds.length; i++) {
        // If common sequence detected, change color and append sequence to matchedSeqs for user feedback
        if (password === commonPswds[i]) {
            document.getElementById("common-password-warning").style.display = "flex";
            matchedPasswords = matchedPasswords.length === 0 ? ": " + commonPswds[i] : matchedPasswords + ", " + commonPswds[i];
        }
    }

    document.querySelector("#common-password-warning span").innerHTML = matchedPasswords;
}


// Check that there is one upper and lowercase letter in the password
function checkCase(password) {
    if (new RegExp('[a-z]+').test(password) && new RegExp('[A-Z]+').test(password)) {
        updateBulletStyle("password-case", true);
    } else {
        updateBulletStyle("password-case", false);
    }
}

// Contains at least one number in the password
function containsNumber(password) {
    if (new RegExp('[0-9]+').test(password)) {
        updateBulletStyle("password-numbers", true);
    } else {
        updateBulletStyle("password-numbers", false);
    }
}

// Contains at least one special character in the password
function containsSymbol(password) {
    if (new RegExp('[^A-Za-z0-9]').test(password)) {
        updateBulletStyle("password-special", true);
    } else {
        updateBulletStyle("password-special", false);
    }
}

// No consecutive characters
function noSameLetterSequences(password) {
    if (new RegExp('(.)\\1+').test(password)) {
        updateBulletStyle("password-sequences", false);
    } else {
        updateBulletStyle("password-sequences", true);
    }
}

// Sees if a password contains non-ASCII characters
function isASCII(password) {
    let nonASCIIChars = "";
    //
    for (let i = 0; i < password.length; i++) {
        if (!(/^[\x00-\x7F]*$/.test(password.charAt(i)))) {
            if (!nonASCIIChars.includes(password.charAt(i))) {
                nonASCIIChars = nonASCIIChars.length === 0 ? "(" + password.charAt(i) : nonASCIIChars + ", " + password.charAt(i);
            }
        }
    }
    if (nonASCIIChars.length !== 0) {
        nonASCIIChars += ")";
        document.getElementById("common-password-error").style.display = "flex";
    } else {
        document.getElementById("common-password-error").style.display = "none";
    }
    document.querySelector("#common-password-error span").innerHTML = nonASCIIChars;
}

// Do not let the user type in emojis to the password checker tool
function disallowEmojis(password) {
    // Remove emojis from input
    password = password.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi, '');

    return password;
}






