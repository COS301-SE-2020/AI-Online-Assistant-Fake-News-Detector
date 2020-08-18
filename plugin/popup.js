$(() => {
    const Url='http://localhost:3000/Sources'
    $('#input').show();
    $('#output').hide();
    $('#input').html('<input type="button" id="close" value="Close">');

    $('.pluginOptions').on('change', function(){
        if ($('#slct').val()==1) {
            $('#input').html('<label for="article">News Article:</label><br>'+
            '<input type="text" id="article">'+
            '<input type="button" id="analyse" value="Analyse">')
        } else if($('#slct').val()==2){
            $('#input').html('<label for="source">News Source:</label><br>'+
            '<input type="text" id="checkSource">'+
            '<input type="button" id="sourceCheck" value="Check Source">')
        } else{
            $('#input').html('<label for="report">Report Source:</label><br>'+
            '<input type="text" id="reportSource">'+
            '<input type="button" id="sourceReport" value="Report Source">')
        }
    });

    $('#input').on('click', 'input[value="Analyse"]', function() {
        alert('Analyse');
    });
    $('#input').on('click', 'input[value="Check Source"]', function() {
        if (!$('#checkSource').val()) {
            $('#checkSource').css("border", "#E0115F 2px solid");
        } else {
            $.ajax({
                url: 'http://localhost:3000/sources',
                type: "GET",
                success: function(result){
                    alert(result[count]);
                },
                error: function(error){
                    alert(error);
                }
            })
        }
    });
    $('#input').on('click', 'input[value="Report Source"]', function() {
        alert('Report');
    });
 
    $('#close').on('click', function(){
        window.close();
    });
    
});