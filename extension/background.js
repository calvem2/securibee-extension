// Once currently active tab has completed loading, display info from info-tracker.json
// on extension info-tracker tab and add notification icon badge

// Global variables to hold popup text
window.textOne = "We don't have the exact information about this, but we suggest you look through this website's privacy settings to check.";
window.textTwo = "We don't have the exact information about this, but we suggest you look through this website's privacy settings to ensure your information is safe.";
window.textThree = "We don't have the exact information about this, but we suggest you look through this website's privacy settings to check.";
window.webDomain = "WEBSITE";

// update popup when new tab in focus if we have tabs permission
chrome.tabs.onActivated.addListener((activeInfo) => {
    update();
});

// update popup when url changes if we have tabs permission
chrome.tabs.onUpdated.addListener((activeInfo) => {
    update();
});


function update() {
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ["https://*/"]
    }, function(result) {
        if (result) {
            // The extension has the permissions.
            updateExtension();
        } else {
            // The extension doesn't have the permissions.
            resetExtension();
        }
    });
}

// remove badge when popup is closed
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "popup") {
        port.onDisconnect.addListener(function() {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                chrome.browserAction.setBadgeText({text: "", tabId: tabs[0].id});
            });
        });
    }
});

// update extension with relevant popup info, add badge if necessary, and set popup page
function updateExtension() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        // use `url` here inside the callback because it's asynchronous!

        // extract raw url and domain name of current tab
        if (tabs[0] === undefined || tabs[0].url === ""){
            return;
        }
        let url = new URL(tabs[0].url);
        let simplifiedUrl = url.hostname;
        let urlParts = simplifiedUrl.split('.');
        let domain = urlParts[urlParts.length - 2] + '.' + urlParts[urlParts.length - 1];

        // parse info-tracker.json into a obj
        let request = new XMLHttpRequest();
        request.open("GET", "./info-tracker.json", true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let obj = JSON.parse(request.responseText);
                // look through all platform names included in json
                for (let i = 0; i < obj.platforms.p.length; i++) {
                    // if the domain name matches a platform included in the json,
                    // add icon badge and update the text displayed on extension
                    for (let j = 0; j < obj.platforms.p[i].name.length; j++) {
                        if (obj.platforms.p[i].name[j] === domain) {
                            hasInfo = true;
                            textOne = printValues(obj.platforms.p[i].what);
                            textTwo = printValues(obj.platforms.p[i].who);
                            textThree = printValues(obj.platforms.p[i].so);
                            webDomain = domain;

                            chrome.browserAction.setBadgeText({text: "?", tabId: tabs[0].id});
                            chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0], tabId: tabs[0].id});

                            // set popup page to info tracker
                            chrome.browserAction.setPopup({
                                popup: "info-tracker.html"
                            });
                            return;
                        }
                    }
                }

                // if json does not have info on this domain, clear badge and popup text
                chrome.browserAction.setBadgeText({text: "", tabId: tabs[0].id});
                loadNoDomain();
            }
        }
    });
}

// Define recursive function to print nested values
function printValues(obj) {
    var section = "";
    for (var k in obj) {
        let text = "" + obj[k];
        if (text.startsWith('<')) {
            section = section + text;
        } else {
            section = section + "<p>" + text + "</p>";
        }
    }
    return section;
}

// reset to default information
function resetExtension() {
    textOne = "This tool is turned off. You can enable it to view this information by turning this tool on.";
    textTwo = "This tool is turned off. You can enable it to view this information by turning this tool on.";
    textThree = "This tool is turned off. You can enable it to view this information by turning this tool on.";
    webDomain = "THIS WEBSITE";
    chrome.browserAction.setPopup({
        popup: "password-checker.html"
    });
}

function loadNoDomain() {
    textOne = "We don't have the exact information about this, but we suggest you look through this website's privacy settings to check.";
    textTwo = "We don't have the exact information about this, but we suggest you look through this website's privacy settings to ensure your information is safe.";
    textThree = "We don't have the exact information about this, but we suggest you look through this website's privacy settings to check.";
    webDomain = "THIS WEBSITE";
    chrome.browserAction.setPopup({
        popup: "password-checker.html"
    });
}


