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
        // permissionsButton.checked = result;
        //todo: get rid of
        if (result) {
            // The extension has the permissions.
            permissionsButton.checked = true;
            console.log("has permissions")
        } else {
            // The extension doesn't have the permissions.
            permissionsButton.checked = false;
            console.log("does not have permission")
        }
    });

    // add onclick for dropdown menus
    dropdownOnClick();

    // update information in popup
    updatePopup();

    // Add listener to settings toggle button to ask for or remove tabs permissions
    permissionsButton.addEventListener('click', function(event) {
        if (permissionsButton.checked) {
            chrome.permissions.request({
                permissions: ['tabs'],
                origins: ["https://*/"]
            }, function(granted) {
                // permissionsButton.checked = granted;
                //todo: delte
                if (granted) {
                    permissionsButton.checked = true;
                    console.log("granted");
                } else {
                    permissionsButton.checked = false;
                    console.log("denied")
                    // permissionsButton.checked = false;
                }
            });
        } else {
            chrome.permissions.remove({
                permissions: ['tabs'],
                origins: ["https://*/"]
            }, function(removed) {
                // todo: removed
                if (removed) {
                    permissionsButton.checked = false;
                    // The permissions have been removed.
                    console.log("removed");
                } else {
                    // The permissions have not been removed (e.g., you tried to remove
                    // required permissions).
                    console.log("not removed");
                }
            });
        }


        // todo: get rid of me
        chrome.permissions.contains({
            permissions: ['tabs'],
            origins: ["https://*/"]
        }, function(result) {
            if (result) {
                // The extension has the permissions.
                console.log("has permissions")
            } else {
                // The extension doesn't have the permissions.
                console.log("does not have permission")
            }
        });

        // reload page and extension
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
        // setTimeout(function() {
        //     window.close();
        // }, 2000)

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



