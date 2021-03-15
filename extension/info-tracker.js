// get background page of extension
let background = chrome.extension.getBackgroundPage();
let permissionsButton = document.querySelector('#permissions input');

// popup connection listener
chrome.runtime.connect({ name: "popup" });

window.onload = function() {
    // Check if we have permission to access tabs
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ["https://*/"]
    }, function(result) {
        permissionsButton.checked = result;
    });

    // add onclick for dropdown menus
    dropdownOnClick();

    // update information in popup
    updatePopup();

    // Add listener to settings toggle button to ask for or remove tabs permissions
    permissionsButton.addEventListener('click', (event) => {
        if (permissionsButton.checked) {
            chrome.permissions.request({
                permissions: ['tabs'],
                origins: ["https://*/"]
            }, function(granted) {
                permissionsButton.checked = granted;
            });
        } else {
            chrome.permissions.remove({
                permissions: ['tabs'],
                origins: ["https://*/"]
            }, function(removed) {
                permissionsButton.checked = !removed;
            });
        }

        // reload page and extension
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
        setTimeout(function() {
            window.close();
        }, 500)

    });
};

// update popup with information for current domain
function updatePopup() {
    document.getElementById("one").innerHTML = background.textOne;
    document.getElementById("two").innerHTML = background.textTwo;
    document.getElementById("three").innerHTML = background.textThree;
    let websiteName = document.getElementsByClassName("tracker-website");
    for (let k = 0; k < websiteName.length; k++) {
        websiteName[k].innerHTML = background.webDomain; // general domain (e.g. google)
    }
}



