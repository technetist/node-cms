import "../scss/home/main.scss";
import 'bootstrap';
let jQuery = require("jquery");
(function ($) {

    $('#logout-btn').click(function () {
      $.post('/logout').done((response) => {
        window.location = response.redirect;
      });
    });
})(jQuery);
