$(() => {
    
    chrome.browserAction.setIcon({
      path : {
          "16": "icon16.png",
      }
    });
    
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let tabUrl = tabs[0].url;
        let cleanUrl = tabUrl.substring(0,tabUrl.indexOf('/',8)+1);
        getSources().then(data => {
            data['response']['Sources'].forEach(source => {
                if (source['Domain Name']===cleanUrl) {
                    chrome.browserAction.setIcon({
                        path : {
                            "16": "bad.png",
                        }
                    });
                }
            });
        })    
    });

    const serverTld='http://54.172.96.111:8080/api/'
    const sourcesUrl=serverTld+'Sources/'
    const reportsUrl=serverTld+'Reports/'
    $('#input').show();
    $('#output').hide();
    $('#input').html('<input type="button" id="close" value="Close">');

    $('.pluginOptions').on('change', function(){
        if ($('#slct').val()==1) {
            $('#input').html(analyseHTML)
        } else if($('#slct').val()==2){
            $('#input').html(checkHTML)
        } else{
            $('#input').html(reportHTML)
            // +
            // '<label for="report">Source URL:</label><br>'+
            // '<input type="text" id="reportSource">'+
            // '<input type="button" id="sourceReport" value="Report Source">')
        }
    });
    $('#input').on('change', 'select[name="reportSelect"]', function() {
        if ($('#reportSelect').val()==1) {
            $('#input').html('<label for="report">Source URL:</label><br>'+
            '<input type="text" id="report">'+
            '<input type="button" id="reportInput" value="Report Source">')
        } else {
            $('#input').html('<label for="report">Statement:</label><br>'+
            '<input type="text" id="report">'+
            '<input type="button" id="reportInput" value="Report Statement">')
        }
    });
 //////////////////////////////////////////////////////   
 ///////////////////ANALYSE NEWS ARTICLE///////////////
 //////////////////////////////////////////////////////   
    $('#input').on('click', 'input[value="Analyse"]', function() {
        if (!$('#article').val()) {
            $('#article').css("border", "#E0115F 2px solid");
        } else {
            
        }
    });
//////////////////////////////////////////////////////   
///////////////////CHECK NEWS SOURCE//////////////////
//////////////////////////////////////////////////////   
$('#input').on('click', 'input[value="Check Source"]', function() {
    $('.pluginOptions').hide();
    let found = false;
    let userInput = $('#checkSource').val();
    if (!$('#checkSource').val()) {
        $('#checkSource').css("border", "#E0115F 2px solid");
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
    //////////////////REPORT NEWS SOURCE//////////////////
    //////////////////////////////////////////////////////   
    $('#input').on('click', 'input[value="Report Source"], input[value="Report Statement"]', function() {
        $('.pluginOptions').hide();
        //User is trying to log an empty report
        if (!$('#report').val()) {
            $('#report').css("border", "#E0115F 2px solid");
        //User has entered data
        } else {
            //User is trying to report a source
            if ($('#reportInput').val()==='Report Source') {
                let name = "";
                let validUrl = false;
                let type = 2;
                let description = $('#reportInput').val();
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
                    alert('error');
                }
                //User is trying to report a statement
            } else {
                let type = 1;
                let statement = $('#reportInput').val();
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
    const analyseHTML='<label for="article">News Article:</label><br>'+
    '<input type="text" id="article">'+
    '<input type="button" id="analyse" value="Analyse">';

    const checkHTML = '<label for="source">News Source URL:</label><br>'+
    '<input type="text" id="checkSource">'+
    '<input type="button" id="sourceCheck" value="Check Source">';

    const reportHTML = '<div class="reportOptions"><select name="reportSelect" id="reportSelect">'+
    '<option selected disabled>Choose An Option...</option>'+
    '<option value="1">Source</option>'+
    '<option value="2">Statement</option>'+
    '</select></div>';
});'<label for="article">News Article:</label><br>'+
'<input type="text" id="article">'+
'<input type="button" id="analyse" value="Analyse">'