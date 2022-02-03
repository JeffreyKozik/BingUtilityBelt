let devMode = true;
function devConsole(log){
    if(devMode){
        console.log(log);
    }
}
function displayNumberOfAdsOnEachTab(){
    devConsole("Displaying number of ads on each tab")
    let adCountTable = document.getElementById("adCountTable");
    adCountTable.innerHTML = '';
    chrome.tabs.query({}, function(tabs) {
        for(let i = 0; i < tabs.length; i++){
            let tab = tabs[i];
            if(tab.url.indexOf("bing.com") != -1 && tab.title.indexOf(" ads ") != -1){
                devConsole(tab.title);
                let thisTabAdCountRow = document.createElement("tr");
                let thisTabAdCount = document.createElement("td");
                thisTabAdCount.innerHTML = tab.title;
                thisTabAdCountRow.appendChild(thisTabAdCount);
                adCountTable.appendChild(thisTabAdCountRow);
            }
        }
    });
}

displayNumberOfAdsOnEachTab()
