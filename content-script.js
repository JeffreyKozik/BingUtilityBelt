let devMode = true;
function devConsole(log){
    if(devMode){
        console.log(log);
    }
}
function ensureRecentResults(){
    let currentUrl = document.location.href;
    devConsole("currentUrl: " + currentUrl);
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
        document.location.href = newUrl;
        devConsole("Now result is more recent.")
    }
}
function isNewAd(thisAd, adElements){
    for(let i = 0; i < adElements.length; i++){
        if(thisAd.getAttribute('data-bm') == adElements[i].getAttribute('data-bm')){
            return false;
        }
    }
    return true;
}
function turnb_adsRed(adElements){
    let b_ads = document.getElementsByClassName("b_ad");
    for (let i = 0; i < b_ads.length; i++){
        let b_adsChildren = b_ads[i].children;
        devConsole("b_adsChildren: ");
        devConsole(b_adsChildren);
        for (let j = 0; j < b_adsChildren.length; j++){
            let b_adsList = b_adsChildren[j];
            devConsole("b_adsList: ");
            devConsole(b_adsList);
            if (b_adsList.tagName == "UL"){
                let b_adsListChildren = b_adsList.children;
                devConsole("b_adsListChildren: ");
                devConsole(b_adsListChildren);
                for (let k = 0; k < b_adsListChildren.length; k++){
                    devConsole("b_adsListChildren[" + k + "]: ");
                    devConsole(b_adsListChildren[k]);
                    if(isNewAd(b_adsListChildren[k], adElements)){
                        adElements.push(b_adsListChildren[k]);
                    }
                }
                break;
            }
        }
    }
}
function turnb_adLastChildsRed(adElements){
    let b_adLastChilds = document.getElementsByClassName("b_adLastChild");
    devConsole("b_adLastChilds: ");
    devConsole(b_adLastChilds);
    for (let i = 0; i < b_adLastChilds.length; i++){
        devConsole("b_adLastChilds[" + i + "]: ");
        devConsole(b_adLastChilds[i]);
        if(isNewAd(b_adLastChilds[i], adElements)){
            adElements.push(b_adLastChilds[i]);
        }
    }
    for (let i = 0; i < adElements.length; i++){
        devConsole("adElements[" + i + "]: ");
        devConsole(adElements[i]);
        adElements[i].style.backgroundColor = "red";
    }
}
function countAds(adElements){
    let adCount = adElements.length;
    let tabName = document.getElementsByTagName('title')[0].innerHTML;
    devConsole(tabName);
    let searchNameStartIndex = 0;
    if(tabName.indexOf("ads ") != -1){
        searchNameStartIndex = tabName.indexOf("ads ") + 4;
    }
    devConsole("searchNameStartIndex: " + searchNameStartIndex);
    let searchName = tabName.slice(searchNameStartIndex, tabName.length);
    devConsole("searchName: " + searchName);
    document.getElementsByTagName('title')[0].innerHTML = adCount.toString() + " ads " + searchName;
    devConsole("adCount: " + adCount);
}
function turnAdsRed(){
    let adElements = [];
    turnb_adsRed(adElements);
    turnb_adLastChildsRed(adElements);
    countAds(adElements);
}
function turnAdsRedAndEnsureRecentResults(){
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if(!window.chrome.runtime.lastError) {
                ensureRecentResults();
                turnAdsRed();
                sendResponse({farewell: "Ads Detected"});
            }
        }
    );
}

turnAdsRedAndEnsureRecentResults();
