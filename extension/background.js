// Once currently active tab has completed loading, display info from info-tracker.json
// on extension info-tracker tab and add notification icon badge

// Global variables to hold popup text
// todo: format info-tracker for when no info to show
window.textOne = "";
window.textTwo = "";
window.textThree = "";
window.webDomain = "WEBSITE";

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.active) {
chrome.tabs.onActivated.addListener((activeInfo) => {
    updateExtension();
});

chrome.tabs.onUpdated.addListener((activeInfo) => {
    updateExtension();
});

function updateExtension() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        // use `url` here inside the callback because it's asynchronous!

        // extract raw url and domain name of current tab
        if (tabs[0].url === ""){
            return;
        }
        let url = new URL(tabs[0].url);
        let simplifiedUrl = url.hostname;
        let urlParts = simplifiedUrl.split('.');
        let domain = urlParts[urlParts.length - 2];
        console.log('domain: ', domain);

        // parse info-tracker.json into a obj
        let request = new XMLHttpRequest();
        request.open("GET", "./info-tracker.json", true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let obj = JSON.parse(request.responseText);
                // console.log('object: ', obj);
                // console.log('first platform in json: ', obj.platforms.p[0].name);

                // look through all platform names included in json
                let hasInfo = false;
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

                            // chrome.browserAction.setBadgeText({text: "?", tabId: tabId});
                            // chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0], tabId: tabId});
                            chrome.browserAction.setBadgeText({text: "?", tabId: tabs[0].id});
                            chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0], tabId: tabs[0].id});
                        }
                    }
                }

                // if json does not have info on this domain, clear badge and popup text
                if (!hasInfo) {
                    // chrome.browserAction.setBadgeText({text: "", tabId: tabId});
                    chrome.browserAction.setBadgeText({text: "", tabId: tabs[0].id});
                    // todo: format info-tracker for when no info to show
                    textOne = "";
                    textTwo = "";
                    textThree = "";
                    webDomain = "WEBSITE";
                }
            }
        }
        // }
    });
}

// Define recursive function to print nested values
function printValues(obj) {
    var section = "";
    for (var k in obj) {
        section = section + "<p>" + obj[k] + "</p>";
    }
    return section;
}

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     console.log("hi");
//     if (changeInfo.status === 'complete' && tab.active) {
//
//         // extract raw url and domain name of current tab
//         var url = new URL(tab.url);
//         var simplifiedUrl = url.hostname;
//         var urlParts = simplifiedUrl.split('.');
//         var domain = urlParts[urlParts.length - 2];
//         console.log('domain: ', domain);
//
//         // parse info-tracker.json into a obj
//         var request = new XMLHttpRequest();
//         request.open("GET", "./info-tracker.json", true);
//         request.send(null)
//         request.onreadystatechange = function() {
//             if ( request.readyState === 4 && request.status === 200 ) {
//                 obj = JSON.parse(request.responseText);
//                 // console.log('object: ', obj);
//                 // console.log('first platform in json: ', obj.platforms.p[0].name);
//
//                 // look through all platform names included in json
//                 var hasInfo = false;
//                 for (var i = 0; i < obj.platforms.p.length; i++) {
//
//                     // if the domain name matches a platform included in the json,
//                     // add icon badge and update the text displayed on extension
//                     if (obj.platforms.p[i].name === domain) {
//                         hasInfo = true;
//                         chrome.browserAction.setBadgeText({text: "?", tabId: tabId});
//                         chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0], tabId:tabId});
//
//                         // attempt to make info-tracker popup - nothing happens
//                         // chrome.browserAction.setPopup({popup: "info-tracker.html", tabId: tabId});
//
//                         // populate text from json to extension display
//                         // textOne = printValues("", obj.platforms.p[i].what);
//                         // console.log(textOne);
//                         // document.getElementById("one").innerHTML = textOne;
//                         // var textTwo = printValues("", obj.platforms.p[i].who);
//                         // document.getElementById("two").innerHTML = textTwo;
//                         // var textThree = printValues("", obj.platforms.p[i].so);
//                         // document.getElementById("three").innerHTML = textThree;
//
//                     }
//                 }
//
//                 // if json does not have info on this domain, clear badge text
//                 if (!hasInfo) {
//                     chrome.browserAction.setBadgeText({text: "", tabId:tabId});
//                 }
//             }
//         }
//     }
// });



