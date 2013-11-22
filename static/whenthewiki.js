{
    $( document ).ready(function() {
        $('#wiki_name_form').submit(function(event) {
            page_name = $("#wiki_name_input").val();
            var url = "/" + page_name;
            $.ajax({
                type: "GET",
                url: url,
                success: function(data) {
                    if (data['success']) {
                        $("#result").html(page_name + " was created on " + new Date(data['payload']*1000).toString());
                    } else {
                        $("#result").html("I COULD NOT FIND THAT SORRY");
                    }
                }
            });
            return false; // avoid to execute the actual submit of the form.
            });
    });
}
