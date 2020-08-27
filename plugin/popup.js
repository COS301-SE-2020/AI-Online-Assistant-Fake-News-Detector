$(() => {
    const serverTld='http://54.172.96.111:8080/api/'
    const sourcesUrl=serverTld+'Sources/'
    const reportsUrl=serverTld+'Reports/'
    $('#loading').show();
    $('#input').show();
    $('#output').hide();
    $('#input').html('<h3>Watch out for these sources:</h3>');
    getSources().then(data => {
        let counter=0,i=0,j=0,k=0;
        let max = 0;
        data['response']['Sources'].forEach(source => {
            if (parseInt(source['Rating'])>max) {
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
    $('.pluginSelector').on('click', 'span[id="articleSelector"]', function() {
        $('#articleSelector').addClass('active');
        $('#sourceSelector').removeClass('active');
        $('#reportSelector').removeClass('active');
        $('#input').html(analyseHTML);
    });
    $('.pluginSelector').on('click', 'span[id="sourceSelector"]', function() {
        $('#articleSelector').removeClass('active');
        $('#sourceSelector').addClass('active');
        $('#reportSelector').removeClass('active');
        $('#input').html(checkHTML);
    });
    $('.pluginSelector').on('click', 'span[id="reportSelector"]', function() {
        $('#articleSelector').removeClass('active');
        $('#sourceSelector').removeClass('active');
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
///////////////////ANALYSE NEWS ARTICLE///////////////
//////////////////////////////////////////////////////   
$('#input').on('click', 'input[value="Analyse"]', function() {
    if (!$('#article').val()) {
        $('#article').css("border", "#c72c69 2px solid");
        $('#article').val("Required*");
    } else {
        alert('xd');
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
    //////////////////////////REPORT//////////////////////
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
    const analyseHTML='<label for="article">News Article:</label><br>'+
    '<input type="text" id="article">'+
    '<input type="button" id="analyse" value="Analyse">';
    
    const checkHTML = '<label for="source">News Source URL:</label><br>'+
    '<input type="text" id="checkSource">'+
    '<input type="button" id="sourceCheck" value="Check Source">';
    
    const reportHTML = '<div class="reportSelector">'+
    '<span id="reportCurrentSelector" class="selectionOption">Current Page</span>'+
    '<span id="reportSourceSelector" class="selectionOption">Source URL</span>'+
    '<span id="reportStatementSelector" class="selectionOption">Statement</span>'+
    '</div>';
});