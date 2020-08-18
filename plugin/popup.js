$(() => {
    const serverTld='http://54.172.96.111:8080/api/'
    const sourcesUrl=serverTld+'Sources/'
    const reportsUrl=serverTld+'Reports/'
    $('#input').show();
    $('#output').hide();
    $('#input').html('<input type="button" id="close" value="Close">');

    $('.pluginOptions').on('change', function(){
        if ($('#slct').val()==1) {
            $('#input').html('<label for="article">News Article:</label><br>'+
            '<input type="text" id="article">'+
            '<input type="button" id="analyse" value="Analyse">')
        } else if($('#slct').val()==2){
            $('#input').html('<label for="source">News Source URL:</label><br>'+
            '<input type="text" id="checkSource">'+
            '<input type="button" id="sourceCheck" value="Check Source">')
        } else{
            $('#input').html('<label for="report">Source URL:</label><br>'+
            '<input type="text" id="reportSource">'+
            '<input type="button" id="sourceReport" value="Report Source">')
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
    $('#input').on('click', 'input[value="Report Source"]', function() {
        $('.pluginOptions').hide();
        if (!$('#reportSource').val()) {
            $('#reportSource').css("border", "#E0115F 2px solid");
        } else {
            let name = "";
            let validUrl = false;
            let type = 2;
            let description = $('#reportSource').val();
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
});