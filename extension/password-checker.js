let PASSWORD_LENGTH = 12;
let COMMON_SEQUENCES = ['qwerty', 'asdf', 'zxcvb', 'jkl;', '123', '1234', '123456'];

// load common passwords from file
let commonPswds;
fetch('commonPasswords.txt')
    .then(response => response.text())
    .then(text => commonPswds = text.split(/\r?\n/));

// add onclick to eye icon
const togglePassword = document.getElementById('toggle-password');
const password = document.getElementById('password-input');
togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

window.onload = function() {
    dropdownOnClick();

    // password checker functionality
    let passwordChecker = document.getElementById("password-input");
    passwordChecker.oninput = function () {
        // console.log(passwordChecker.value);
        validatePassword();
    };

    function validatePassword() {
        if (!passwordEmpty(passwordChecker.value)) {
            checkLength(passwordChecker.value);
            commonSequence(passwordChecker.value);
            commonPasswords(passwordChecker.value);
            containsNumber(passwordChecker.value);
            containsSymbol(passwordChecker.value);
            noSameLetterSequences(passwordChecker.value);
            checkCase(passwordChecker.value);
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
            return true;
        }
        return false;
    }
};