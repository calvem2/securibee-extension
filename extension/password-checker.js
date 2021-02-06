// >= 12 characters
// upper & lower case, special symbols, numbers
    // intersperse throughout
// no real words, names
// no repeating characters
// avoid common keyboard sequences

let PASSWORD_LENGTH = 12;
let COMMON_SEQUENCES = ['qwerty', 'asdf', 'zxcvb', 'jkl;', '123', '1234', '123456'];

window.onload = function() {
    let passwordChecker = document.getElementById("password-input");

    passwordChecker.oninput = function () {
        // console.log(passwordChecker.value);
        validatePassword();
    }

    function validatePassword() {
        if (!passwordEmpty(passwordChecker.value)) {
            checkLength(passwordChecker.value);
            commonSequence(passwordChecker.value);
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
            document.getElementById("password-length").style.color = "red";
        } else {
            document.getElementById("password-length").style.color = "green";
        }
    }

    // Check to see if any common sequences are in the password
    function commonSequence(password) {
        // Check common sequences
        document.getElementById("password-common").style.color = "green";
        let matchedSeqs = "";   // common sequences detected
        for (let i = 0; i < COMMON_SEQUENCES.length; i++) {
            // If common sequence detected, change color and append sequence to matchedSeqs for user feedback
            if (password.includes(COMMON_SEQUENCES[i])) {
                document.getElementById("password-common").style.color = "red";
                matchedSeqs = matchedSeqs.length === 0 ? "(" + COMMON_SEQUENCES[i] : matchedSeqs + ", " + COMMON_SEQUENCES[i];
            }
        }
        if (matchedSeqs.length !== 0) {
            matchedSeqs += ")";
        }
        document.querySelector("#password-common span").innerHTML = matchedSeqs;
    }

    // Check that there is one upper and lowercase letter in the password
    function checkCase(password) {
        if (new RegExp('[a-z]+').test(password) && new RegExp('[A-Z]+').test(password)) {
            document.getElementById("password-case").style.color = "green";
        } else {
            document.getElementById("password-case").style.color = "red";
        }
    }

    // Contains at least one number in the password
    function containsNumber(password) {
        if (new RegExp('[0-9]+').test(password)) {
            document.getElementById("password-numbers").style.color = "green";
        } else {
            document.getElementById("password-numbers").style.color = "red";
        }
    }

    // Contains at least one special character in the password
    function containsSymbol(password) {
        if (new RegExp('[^A-Za-z0-9]').test(password)) {
            document.getElementById("password-special").style.color = "green";
        } else {
            document.getElementById("password-special").style.color = "red";
        }
    }

    // No consecutive characters
    function noSameLetterSequences(password) {
        if (new RegExp('(.)\\1+').test(password)) {
            document.getElementById("password-sequences").style.color = "red";
        } else {
            document.getElementById("password-sequences").style.color = "green";
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