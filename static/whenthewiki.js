{
    Date.prototype.getMonthName = function(lang) {
        lang = lang && (lang in Date.locale) ? lang : 'en';
        return Date.locale[lang].month_names[this.getMonth()];
    };

    Date.prototype.getMonthNameShort = function(lang) {
        lang = lang && (lang in Date.locale) ? lang : 'en';
        return Date.locale[lang].month_names_short[this.getMonth()];
    };

    Date.locale = {
        en: {
            month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    };

    function result_string(created_date, page_name) {
        var link = '<a href="http://en.wikipedia.org/wiki/' + page_name +
            '">' + page_name + '</a>';
        created_date = new Date(created_date*1000);
        return "The Wikipedia page for " + link + " was created on " +
                created_date.getMonthName() + " " + created_date.getDate() +
                ", " + created_date.getFullYear();
    }

    $( document ).ready(function() {
        $('#wiki_name_input').focus();
        $('#wiki_name_form').submit(function(event) {
            page_name = $("#wiki_name_input").val();
            var url = "/lookup/" + page_name;
            $.ajax({
                type: "GET",
                url: url,
                success: function(data) {
                    if (data['success']) {
                        $("#result").html(result_string(data['payload'], page_name));
                        window.history.pushState({}, "", '/page/' + page_name);
                    } else {
                        $("#result").html("I COULD NOT FIND THAT SORRY");
                    }
                }
            });
            return false; // avoid to execute the actual submit of the form.
        });
    });
}
