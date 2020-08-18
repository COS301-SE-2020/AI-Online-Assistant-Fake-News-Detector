$(() => {
    const Url='http://localhost:3000/Sources'

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

    $('#analyse').on('click', function(){
        if (!$('#article').val()) {
            $('#article').val('Please enter your text article...');
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




    
    $('#close').on('click', function(){
        window.close();
    });

});