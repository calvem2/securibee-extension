// Once currently active tab has completed loading, display info from info-tracker.json
// on extension info-tracker tab and add notification icon badge

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        // use `url` here inside the callback because it's asynchronous!
        // console.log(url);

        // extract raw url and domain name of current tab
        // var url = new URL(tab.url);
        let url = new URL(tabs[0].url);
        var simplifiedUrl = url.hostname;
        var urlParts = simplifiedUrl.split('.');
        var domain = urlParts[urlParts.length - 2];
        console.log('domain: ', domain);

        // parse info-tracker.json into a obj
        var request = new XMLHttpRequest();
        request.open("GET", "./info-tracker.json", true);
        request.send(null)
        request.onreadystatechange = function() {
            if ( request.readyState === 4 && request.status === 200 ) {
                obj = JSON.parse(request.responseText);
                // console.log('object: ', obj);
                // console.log('first platform in json: ', obj.platforms.p[0].name);

                // look through all platform names included in json
                var hasInfo = false;
                for (var i = 0; i < obj.platforms.p.length; i++) {
                    // if the domain name matches a platform included in the json,
                    // add icon badge and update the text displayed on extension
                    for (var j = 0; j < obj.platforms.p[i].name.length; j++) {
                        if (obj.platforms.p[i].name[j] == domain) {
                            hasInfo = true;
                            chrome.browserAction.setBadgeText({text: "?", tabId: tabs[0].id});
                            chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0], tabId:tabs[0].id});
                        }
                    }
                }

                // if json does not have info on this domain, clear badge text
                if (!hasInfo) {
                    chrome.browserAction.setBadgeText({text: "", tabId:tabs[0].id});
                }
            }
        }
    });
});

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

// Define recursive function to print nested values
// function printValues(existing, obj) {
//     for(var k in obj) {
//         if(obj[k] instanceof Object) {
//             return existing.append(printValues(obj[k]));
//         } else {
//             var paragraph = "<p>" + obj[k] + "</p>";
//             return paragraph;
//         };
//     }
// };


// From Megan's initial extension creation:

// event handles for tab updates
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    /* TODO: add rules for which extension page to show based on tab url ?
     * (or potentially change to page action)
     */

    // if (tab.url.includes('e')) {
    //     // TODO: set title for popup (tooltip)
    //     // Note: if we change the extension to be a page action, need to use show()
    //
    //     // chrome.pageAction.show(tabId);
    //     // chrome.pageAction.setTitle({
    //     //     tabId: tabId,
    //     //     title: resp.cashback
    //     // });
    //     chrome.browserAction.setPopup({
    //         tabId: tabId,
    //         popup: "test.html"
    //     });
    // } else {
    //     // chrome.pageAction.show(tabId);
    //     // chrome.pageAction.setTitle({
    //     //     tabId: tabId,
    //     //     title: resp.cashback
    //     // });
    //     chrome.browserAction.setPopup({
    //         tabId: tabId,
    //         popup: "popup.html"
    //     });
    // }
// });