const sourcesUrl='http://54.172.96.111:8080/api/Sources/';
chrome.tabs.onActivated.addListener(()=>{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let fakesite = false;
        let tabUrl = tabs[0].url;
        let cleanUrl = tabUrl.substring(0,tabUrl.indexOf('/',8)+1);
        getSources().then(data => {
            data['response']['Sources'].forEach(source => {
                if (source['Domain Name']===cleanUrl) {
                    fakesite=true;
                    chrome.browserAction.setIcon({
                        path : {
                            "16": "bad.png",
                        }
                    });
                }
            });
            if (!fakesite) {
                chrome.browserAction.setIcon({
                    path : {
                        "16": "icon16.png",
                    }
                });
            }
        })    
    });
});
function getSources(){
    return $.ajax({
        url: sourcesUrl,
        dataType: "json",
        type: "GET",
    });
}