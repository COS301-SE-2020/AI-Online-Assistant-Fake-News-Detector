$(() => {
    const sourcesUrl='http://54.172.96.111:8080/api/Sources/'
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
            $('#input').html('<label for="report">Report Source:</label><br>'+
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
        let found = false;
        let userInput = $('#checkSource').val();
        if (!$('#checkSource').val()) {
            $('#checkSource').css("border", "#E0115F 2px solid");
        } else {
            getSources().then(data => {
                let tld = userInput.substring(0,userInput.indexOf('/',8)+1);
                data['response']['Sources'].forEach(source => {
                    if (source['Domain Name']===tld) {
                        $('#input').html('<h3>'+ source['Name'] +' has been spreading fake news recently</h3>'+
                        '<input type="button" id="close" value="Close">');
                        found = true;
                    }
                });
                if (found == false) {
                    $('#input').html('<h3>This source can be trusted</h3>'+
                    '<input type="button" id="close" value="Close">');
                }
            });
        }
    });
    //////////////////////////////////////////////////////   
    //////////////////REPORT NEWS SOURCE//////////////////
    //////////////////////////////////////////////////////   
    $('#input').on('click', 'input[value="Report Source"]', function() {
        if (!$('#reportSource').val()) {
            $('#reportSource').css("border", "#E0115F 2px solid");
        } else {
            
        }
    });
    $('#input').on('click', 'input[value="Close"]', function() {
        window.close();
    });
    
    $('#close').on('click', function(){
    });
    function getSources(){
        return $.ajax({
            url: sourcesUrl,
            dataType: "json",
            type: "GET",
        });
      }
});