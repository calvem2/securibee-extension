window.onload = function() {
    // add onclick to drop downs
    let dropdowns = document.getElementsByClassName("dropdown-container");
    for (let i = 0; i < dropdowns.length; i++) {
        let dropdown = dropdowns[i];

        // add onclick to dropdown title and arrow
        dropdown.children[0].onclick = function() {
            // get children
            let arrow = this.children[1].firstChild;
            let content = this.parentElement.children[1];
            if (arrow.classList.contains("down")) {
                arrow.classList.remove("down");
                arrow.classList.add("up");
                content.style.display = "block";
            } else {
                arrow.classList.add("down");
                arrow.classList.remove("up");
                content.style.display = "none";
            }
        }
    }
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            // extract raw url and domain name of current tab
            let url = tab.url;
            console.log('raw url: ', url);
            var domain = url.replace('http://','').replace('https://','').replace('www.','').replace('.com','').replace('.edu','').replace('.org','').split(/[/?#]/)[0].replace('.','');
            console.log('domain: ', domain);

            // parse info-tracker.json into a obj
            var request = new XMLHttpRequest();
            request.open("GET", "./info-tracker.json", false);
            request.send(null)
            var obj = JSON.parse(request.responseText);
            // console.log('object: ', obj);
            // console.log('part??: ', obj.platforms.p[0].name);
            
            // look through all platform names included in json
            for (var i = 0; i < obj.platforms.p.length; i++) {
                // if the domain name matches a platform included in the json,
                // update the text displayed on extension info-tracker tab
                if (obj.platforms.p[i].name == domain) {
                    var textOne = printValues(obj.platforms.p[i].what);
                    document.getElementById("one").innerHTML = textOne;

                    var textTwo = printValues(obj.platforms.p[i].who);
                    document.getElementById("two").innerHTML = textTwo;

                    var textThree = printValues(obj.platforms.p[i].so);
                    document.getElementById("three").innerHTML = textThree;       
                }
            }
        });
    }

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
});

// Define recursive function to print nested values
function printValues(obj) {
    for(var k in obj) {
        if(obj[k] instanceof Object) {
            return printValues(obj[k]);
        } else {
            // document.write(obj[k] + "<br>");
            var tblRow = "<p>" + obj[k] + "</p>";

            return document.getElementById("one").innerHTML + tblRow;
        };
    }
};
