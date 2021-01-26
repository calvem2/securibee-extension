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
        // Check length
        if (passwordChecker.value.length < PASSWORD_LENGTH) {
            document.getElementById("password-length").style.color = "red";
        } else {
            document.getElementById("password-length").style.color = "green";
        }

        // Check common sequences
        document.getElementById("password-common").style.color = "green";
        let matchedSeqs = "";   // common sequences detected
        for (let i = 0; i < COMMON_SEQUENCES.length; i++) {
            // If common sequence detected, change color and append sequence to matchedSeqs for user feedback
            if (passwordChecker.value.includes(COMMON_SEQUENCES[i])) {
                document.getElementById("password-common").style.color = "red";
                matchedSeqs = matchedSeqs.length === 0 ? "(" + COMMON_SEQUENCES[i] : matchedSeqs + ", " + COMMON_SEQUENCES[i];
            }
        }
        if (matchedSeqs.length !== 0) {
            matchedSeqs += ")";
        }
        document.querySelector("#password-common span").innerHTML = matchedSeqs;

    }
};