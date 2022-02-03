let devMode = true;
function devConsole(log){
    if(devMode){
        console.log(log);
    }
}
function ensureRecentResults(currentUrl){
    let indexOfin2021 = currentUrl.indexOf("in+2021");
    devConsole("indexOfin2021: " + indexOfin2021);
    let in2021NotAddedYet = (indexOfin2021 == -1) || (indexOfin2021 > currentUrl.indexOf("&"));
    devConsole("in2021NotAddedYet: " + in2021NotAddedYet);
    let inSearchMode = currentUrl.indexOf("search?q=") != -1;
    devConsole("inSearchMode: " + inSearchMode);
    if (in2021NotAddedYet && inSearchMode){
        devConsole("Making results more recent.");
        let startIndex = currentUrl.indexOf("search?q=") + 9;
        devConsole("startIndex: " + startIndex);
        let endIndex = currentUrl.indexOf("&");
        devConsole("endIndex: " + endIndex);
        let searchTerms = currentUrl.slice(startIndex, endIndex);
        devConsole("searchTerms: " + searchTerms);
        let prefix = currentUrl.slice(0, startIndex);
        devConsole("prefix: " + prefix);
        let suffix = currentUrl.slice(startIndex, currentUrl.length - 1);
        devConsole("suffix: " + suffix);
        let newUrl = prefix + suffix.replaceAll(searchTerms, searchTerms + "+in+2021");
        devConsole("newUrl: " + newUrl);
        devConsole("Now result is more recent.")
        return(newUrl);
    }
}
function tellContentScriptSearchResultsLoaded(){
    // chrome.webRequest.onCompleted.addListener(
    //     function(details) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let activeTab = tabs[0];
                let currentUrl = activeTab.url;
                devConsole("currentUrl: " + currentUrl);
                chrome.tabs.update(activeTab.id, {url: ensureRecentResults(currentUrl)});
                devConsole("Sending message from service worker to content script.");
                chrome.tabs.sendMessage(tabs[0].id, {greeting: "Response Completed"}, function(response) {
                    devConsole(response.farewell);
                });
            });
//         },
//         {urls: ["*://www.bing.com/*"]}
//     );
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // if(!window.chrome.runtime.lastError) {
            sendResponse({farewell: "I'm awake"});
        // }
    }
);
// setInterval(function(){
    tellContentScriptSearchResultsLoaded();
// }, 1000);
