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

    // log raw url and domain name -- upon window load (adapted below)
    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     let url = tabs[0].url;
    //     // use `url` here inside the callback because it's asynchronous!
    //     console.log('raw url: ', url);
        
    //     var domain = url.replace('http://','').replace('https://','').replace('www','').replace('.com','').replace('.edu','').replace('.org','').split(/[/?#]/)[0];
    //     // .replace('','')

    //     console.log('domain: ', domain);
    // });
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // log raw url and domain name -- upon tabs update (adapted from above)
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tab.url;
        // use `url` here inside the callback because it's asynchronous!
        console.log('raw url: ', url);
        
        var domain = url.replace('http://','').replace('https://','').replace('www','').replace('.com','').replace('.edu','').replace('.org','').split(/[/?#]/)[0].replace('.','');
        // .replace('','')

        console.log('domain: ', domain);
    });

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

