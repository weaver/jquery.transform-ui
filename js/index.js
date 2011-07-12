(function($) {

  $(function() {
    var trans = $('.transformable')
        .transformable({ containment: 'parent' });

    var mode = $('#mode')
      .change(function(ev) {
        trans.transformable('setMode', mode.val());
      });

    mode.change();
  });

})(jQuery);