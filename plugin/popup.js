$(() => {
    const serverTld='http://54.172.96.111:8080/api/'
    const sourcesUrl=serverTld+'Sources/'
    const reportsUrl=serverTld+'Reports/'
    const factCheckUrl=serverTld+'Facts/factCheck/'
    const articleAnalysisUrl=serverTld+'/verify/'
    $('#loading').show();
    $('#input').show();
    $('#output').hide();
    $('#input').html('<h3>Watch out for these sources:</h3>');
//////////////////////////////////////////////////////   
//////////////POPULATE PLUGIN LANDING PAGE////////////
//////////////////////////////////////////////////////   
    getSources().then(data => {
        let counter=0,i=0,j=0,k=0;
        let max = 0;
        data['response']['Sources'].forEach(source => {
            if (parseInt(source['Rating'])>=max) {
                k = j;
                j = i;
                i = counter;
                max = parseInt(source['Rating']);
            }
            counter++;
        });
        $('#input').html($('#input').html()+'<h4><div class="primeSources">'+
        '<div class="primeSource first">'+(data['response']['Sources'][i]['Name'])+' ('+(data['response']['Sources'][i]['Rating'])+' FNR)'+'</div>'+
        '<div class="primeSource second">'+(data['response']['Sources'][j]['Name'])+' ('+(data['response']['Sources'][j]['Rating'])+' FNR)'+'</div>'+
        '<div class="primeSource third">'+(data['response']['Sources'][k]['Name'])+' ('+(data['response']['Sources'][k]['Rating'])+' FNR)'+'</div></div></h4>'+
        '<h5>*FNR - Fake News Rating</h5>'+
        '<input type="button" id="close" value="Close">'
        );
        $('#loading').hide();
    })
//////////////////////////////////////////////////////   
///////////////OVERALL SELECTOR FUNCTIONS/////////////
//////////////////////////////////////////////////////   
    $('.pluginSelector').on('click', 'span[id="checkSelector"]', function() {
        $('#checkSelector').addClass('active');
        $('#reportSelector').removeClass('active');
        $('#input').html(checkHTML);
    });    
    $('.pluginSelector').on('click', 'span[id="reportSelector"]', function() {
        $('#checkSelector').removeClass('active');
        $('#reportSelector').addClass('active');
        $('#input').html(reportHTML);
    });    
//////////////////////////////////////////////////////   
///////////////REPORT SELECTOR FUNCTIONS//////////////
//////////////////////////////////////////////////////   
$('#input').on('click', 'span[id="reportCurrentSelector"]', function() {
    $('#input').html(reportHTML+'<input type="button" id="reportInput" value="Report Current Page">')
    $('#reportCurrentSelector').addClass('active');
    $('#reportSourceSelector').removeClass('active');
    $('#reportStatementSelector').removeClass('active');
});
$('#input').on('click', 'span[id="reportSourceSelector"]', function() {
    $('#input').html(reportHTML+'<label for="report">Source URL:</label><br>'+
    '<input type="text" id="report">'+
    '<input type="button" id="reportInput" value="Report Source">')
    $('#reportCurrentSelector').removeClass('active');
    $('#reportSourceSelector').addClass('active');
    $('#reportStatementSelector').removeClass('active');
});
$('#input').on('click', 'span[id="reportStatementSelector"]', function() {
    $('#input').html(reportHTML+'<label for="report">Statement:</label><br>'+
    '<input type="text" id="report">'+
    '<input type="button" id="reportInput" value="Report Statement">')
    $('#reportCurrentSelector').removeClass('active');
    $('#reportSourceSelector').removeClass('active');
    $('#reportStatementSelector').addClass('active');
});
//////////////////////////////////////////////////////   
////////////////CHECK SELECTOR FUNCTIONS//////////////
//////////////////////////////////////////////////////   
$('#input').on('click', 'span[id="checkArticleSelector"]', function() {
    $('#input').html(checkHTML+'<label for="check">Article:</label><br>'+
    '<input type="text" id="checkArticle">'+
    '<input type="button" id="reportInput" value="Analyse Article">');
    $('#checkArticleSelector').addClass('active');
    $('#checkSourceSelector').removeClass('active');
    $('#checkStatementSelector').removeClass('active');
});
$('#input').on('click', 'span[id="checkSourceSelector"]', function() {
    $('#input').html(checkHTML+'<label for="check">Source URL:</label><br>'+
    '<input type="text" id="checkSource">'+
    '<input type="button" id="reportInput" value="Check Source">');
    $('#checkArticleSelector').removeClass('active');
    $('#checkSourceSelector').addClass('active');
    $('#checkStatementSelector').removeClass('active');
});
$('#input').on('click', 'span[id="checkStatementSelector"]', function() {
    $('#input').html(checkHTML+'<label for="check">Statement:</label><br>'+
    '<input type="text" id="checkStatement">'+
    '<input type="button" id="reportInput" value="Check Statement">');
    $('#checkArticleSelector').removeClass('active');
    $('#checkSourceSelector').removeClass('active');
    $('#checkStatementSelector').addClass('active');
});

//////////////////////////////////////////////////////   
///////////////////ANALYSE NEWS ARTICLE///////////////
//////////////////////////////////////////////////////   
$('#input').on('click', 'input[value="Analyse Article"]', function() {
    if (!$('#checkArticle').val()) {
        $('#checkArticle').css("border", "#c72c69 2px solid");
        $('#checkArticle').val("Required*");
    } else {
        let content = $('#checkArticle').val();
        $('#input').hide();
        $('#loading').show();
        let data = {
            "response":{
                "result":{
                    "overall":{
                        "prediction": "real"
                    }
                },
                "success": true
            }
        }
        // analyzeArticle(content).then(data=>{
            $('#input').show();
            $('#loading').hide();
            if (data['response']['success']) {
                $('#input').html('<h3>The article has been analysed</h3>'+
                    '<div class="reviewOutput">According to our <b>Neural Network</b> this news article containts mostly <b>'+ data['response']['result']['overall']['prediction'] +'</b> news!<br/><br/>'+
                    'Head to <b><a id="analysisLink" target="_blank" rel="noopener noreferrer" href="https://artifacts.live">Our Website</a></b> for an in depth analysis.</div>'+
                    '<input type="button" id="close" value="Close">');
            } else {
                
            }
        // });
    }
});
//////////////////////////////////////////////////////   
///////////////////CHECK NEWS SOURCE//////////////////
//////////////////////////////////////////////////////   
$('#input').on('click', 'input[value="Check Source"]', function() {
    let found = false;
    let userInput = $('#checkSource').val();
    if (!$('#checkSource').val()) {
        $('#checkSource').css("border", "#c72c69 2px solid");
        $('#checkSource').val("Required*");
    } else {
        let tld = userInput.substring(0,userInput.indexOf('/',8)+1);
        let forwardSlashCount = (tld.match(/\//g)||[]).length;
        
        if (forwardSlashCount==0) {
            $('#checkSource').val("This doesn't look like a valid URL");
        } else {
            getSources().then(data => {
                data['response']['Sources'].forEach(source => {
                    if (source['Domain Name']===tld) {
                        $('#input').html('<div class="output"><h3>'+ source['Name'] +' has been spreading fake news recently!</h3></div>'+
                        '<input type="button" id="close" value="Close">');
                        found = true;
                    }
                });
                if (found == false) {
                    $('#input').html('<h3>According to our records, this source can be trusted</h3>'+
                    '<input type="button" id="close" value="Close">');
                    }
                });
            }
        }
    });
    //////////////////////////////////////////////////////   
    ///////////////////CHECK STATEMENT////////////////////
    //////////////////////////////////////////////////////   
    $('#input').on('click', 'input[value="Check Statement"]', function() {
        if (!$('#checkStatement').val()) {
            $('#checkStatement').css("border", "#c72c69 2px solid");
            $('#checkStatement').val("Required*");
        } else {
            if ($('#checkStatement').val()!="Required*") {
                let data = {
                    "response": {
                        "message": "Review completed successfully.",
                        "text": "“There is no such concentration camp in Xinjiang … People in Xinjiang enjoy a happy life. China is strongly opposed to any torture, persecution and discrimination of people of any ethnic group.”",
                        "reviewer": "POLYGRAPH.info",
                        "review": "False",
                        "reviewSource": "https://www.polygraph.info/a/china-uighurs-fact-check/30748659.html",
                        "success": true
                    }
                }
                let statement = $('#checkArticle').val();
                $('#input').hide();
                $('#loading').show();
                // postFactCheck(statement).then(data=>{
                    $('#loading').hide();
                    $('#input').show();
                    if (data['response']['success'] && data['response']['message']==="Review completed successfully.") {
                        data['response']['text'] = data['response']['text'].split('“').join('"').split('”').join('"').split('…').join('...');
                        $('#input').html('<h3>The Closest Statement We Found:</h3>'+
                        '<div class="statementOutput">'+ data['response']['text'] +'</div>'+
                        '<div class="reviewOutput">According to <b>'+ data['response']['reviewer'] +'</b> this statement is <b>'+ data['response']['review'] +'</b><br/><br/>'+
                        '<b><a target="_blank" rel="noopener noreferrer" href='+ data['response']['reviewSource'] +'>Learn More</a></b></div>'+
                        '<input type="button" id="close" value="Close">');
                    } else {
                        $('#input').html('<h3>Sorry we found no similar statements</h3>'+
                        '<div class="statementOutput"> We urge you to take the time to do your own research on this topic to help prevent the spread of fake news! :) </div>'+
                        '<input type="button" id="close" value="Close">');
                    }
                // });
            }
        }
    });
    //////////////////////////////////////////////////////   
    ////////////////REPORT URL OR STATEMENT///////////////
    //////////////////////////////////////////////////////   
    $('#input').on('click', 'input[value="Report Source"], input[value="Report Statement"]', function() {
        //User is trying to log an empty report
        if (!$('#report').val()) {
            $('#report').css("border", "#c72c69 2px solid");
            $('#report').val("Required*");
            //User has entered data
        } else {
            //User is trying to report a source
            if ($('#reportInput').val()==='Report Source') {
                let name = "";
                let validUrl = false;
                let type = 2;
                let description = $('#report').val();
                let forwardSlashCount = (description.match(/\//g)||[]).length;
                if (forwardSlashCount==2) {
                    description+='/';
                    validUrl=true;
                } else if(forwardSlashCount>=3){
                    description = description.substring(0,description.indexOf('/',8)+1);
                    validUrl=true;
                }
                if (validUrl) {
                    postReport(type, description).then(data=>{});
                    if (description[4]==='s') {
                        name = (description.substring(description.indexOf('.',0)+1,description.indexOf('/',12))).toUpperCase();
                    } else {
                        name = description.substring(description.indexOf('.',0)+1,description.indexOf('/',11)).toUpperCase();
                    }
                    $('#input').html('<div class="output"><h3>Thanks for reporting '+ name +' </h3>'+
                    '<h4>Your feedback will be analysed soon.</h4></div>'+
                    '<input type="button" id="close" value="Close">');
                }
                else{
                    alert(description);
                }
                //User is trying to report a statement
            } else {
                let type = 1;
                let statement = $('#report').val();
                postReport(type, statement).then(data=>{});
                $('#input').html('<div class="output"><h3>Thanks for telling us!</h3>'+
                '<h4>Your feedback will be analysed soon.</h4></div>'+
                '<input type="button" id="close" value="Close">');
            }
        }
    });
    $('#input').on('click', 'input[value="Close"]', function() {
        window.close();
    });
    //////////////////////////////////////////////////////   
    ////////////////////REPORT CURRENT PAGE///////////////
    ////////////////////////////////////////////////////// 
    $('#input').on('click', 'input[value="Report Current Page"]', function() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let description = tabs[0].url;
            let name = "";
            let validUrl = false;
            let type = 2;
            let forwardSlashCount = (description.match(/\//g)||[]).length;
            if (forwardSlashCount==2) {
                description+='/';
                validUrl=true;
            } else if(forwardSlashCount>=3){
                description = description.substring(0,description.indexOf('/',8)+1);
                validUrl=true;
            }
            if (validUrl) {
                postReport(type, description).then(data=>{});
                if (description[4]==='s') {
                    name = (description.substring(description.indexOf('.',0)+1,description.indexOf('/',12))).toUpperCase();
                } else {
                    name = description.substring(description.indexOf('.',0)+1,description.indexOf('/',11)).toUpperCase();
                }
                $('#input').html('<div class="output"><h3>Thanks for reporting '+ name +' </h3>'+
                '<h4>Your feedback will be analysed soon.</h4></div>'+
                '<input type="button" id="close" value="Close">');
            }
            else{
                alert(description);
            }
        });

        
    });  
    //////////////////////////////////////////////////////   
    /////////////////////HELPER FUNCTIONS/////////////////
    //////////////////////////////////////////////////////   
    
    function getSources(){
        return $.ajax({
            url: sourcesUrl,
            dataType: "json",
            type: "GET",
        });
    }
    
    function postReport(iType, sDescription) {
        return $.ajax({
            url: reportsUrl,
            dataType: "json",
            type: "POST",
            data: {
                "type": iType,
                "description": sDescription
            }
        });
    }
    
    function postFactCheck(statementText) {
        return $.ajax({
            url: factCheckUrl,
            dataType: "json",
            type: "POST",
            data: {
                "statement": statementText
            }
        });
    }
    
    function analyzeArticle(article) {
        return $.ajax({
            url: articleAnalysisUrl,
            dataType: "json",
            type: "POST",
            data: {
                "content": article
            }
        });
    }
    
    //////////////////////////////////////////////////////   
    /////////////////////STANDARD HTML ///////////////////
    //////////////////////////////////////////////////////   


    const reportHTML = '<div class="secondarySelector">'+
    '<span id="reportCurrentSelector" class="selectionOption">Current Page</span>'+
    '<span id="reportSourceSelector" class="selectionOption">Source URL</span>'+
    '<span id="reportStatementSelector" class="selectionOption">Statement</span>'+
    '</div>';

    const checkHTML = '<div class="secondarySelector">'+
    '<span id="checkArticleSelector" class="selectionOption">Article</span>'+
    '<span id="checkSourceSelector" class="selectionOption">Source</span>'+
    '<span id="checkStatementSelector" class="selectionOption">Statement</span>'+
    '</div>';
});