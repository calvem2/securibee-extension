window.onload = function() {
    dropdownOnClick();
    updatePopup();
};

function updatePopup() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        // let url = tabs[0].url;

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

                            // chrome.browserAction.setBadgeText({text: "?", tabId: tabs[0].id});
                            // chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0], tabId:tabs[0].id});

                            // attempt to make info-tracker popup - nothing happens
                            // chrome.browserAction.setPopup({popup: "info-tracker.html", tabId: tabId});

                            // populate text from json to extension display
                            var textOne = printValues(obj.platforms.p[i].what);
                            document.getElementById("one").innerHTML = textOne;
                            var textTwo = printValues(obj.platforms.p[i].who);
                            document.getElementById("two").innerHTML = textTwo;
                            var textThree = printValues(obj.platforms.p[i].so);
                            document.getElementById("three").innerHTML = textThree;

                            // show domain name
                            var websiteName = document.getElementsByClassName("tracker-website");
                            for (var k = 0; k < websiteName.length; k++) {
                                websiteName[k].innerHTML = obj.platforms.p[i].name[0]; // general domain (e.g. google)
                                // websiteName[k].innerHTML = domain; // specific domain (e.g. youtube)
                            }
                            
                        }
                    }
                }
            }
        }
    });
};

// Define recursive function to print nested values
function printValues(obj) {
    var section = "";
    for (var k in obj) {
        section = section + "<p>" + obj[k] + "</p>";
    }
    return section;
}