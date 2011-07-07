(function($) {

  $(function() {
    $('.transformable')
      .transform({ skewX: '-10.5deg' })
      .transformable({ containment: 'parent' });
  });

})(jQuery);