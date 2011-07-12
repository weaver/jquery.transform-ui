(function($) {

   $.widget('ui.transformable', $.ui.mouse, {
     options: {
       containment: false,
       handles: 'n, e, s, w, ne, se, sw, nw',
       cornerIndex: 1000,
       mode: 'resize'
     },

     _create: function() {
       var opt = this.options;

       var content = this.content = this.element;

       var el = this.element = this.content
         .addClass('ui-widget-content')
         .wrap('<div class="ui-transformable" />')
         .parent()
         .css({
           position: 'absolute',
           width: content.outerWidth(),
           height: content.outerHeight()
         })
         .draggable({
           handle: this.element,
           containment: opt.containment
         });

       content.css({ width: '100%', height: '100%' });

       var self = this;
       var handles = this.handles = {};

       $.each(opt.handles.split(/[\s,]+/g), function(_, axis) {
         var handle = $('<div class="ui-transformable-handle" />')
           .addClass('ui-transformable-' + axis);

         if (axis.length == 2)
           handle
             .addClass('ui-transformable-corner')
             .css('z-index', opt.cornerIndex);

         handles[axis] = handle.appendTo(el);
       });

       this.mode = opt.mode;
       this._mouseInit();
     },

     _destroy: function() {
       this.el.draggable('destroy');
       this._mouseDestroy();
     },

     setMode: function(mode) {
       this.mode = mode;
     },

     _mouseCapture: function(ev) {
       this.axis = null;

       if (!(this.mode in this.change))
         return false;

       for (var axis in this.handles) {
         if (this.handles[axis][0] == ev.target) {
           if (axis in this.change[this.mode]) {
             this.axis = axis;
             return true;
           }
           return false;
         }
       }

       return false;
     },

     _mouseStart: function(ev) {
       this.origMousePos = { left: ev.pageX, top: ev.pageY };
       this.change[this.mode].start.call(this, ev);
     },

     _mouseDrag: function(ev) {
       var omp = this.origMousePos,
           dx = ev.pageX - omp.left,
           dy = ev.pageY - omp.top;

       var base = this.change[this.mode];
       var data = base[this.axis].call(this, ev, dx, dy);
       base.drag.call(this, ev, dx, dy, data);
     },

     _mouseStop: function(ev) {
     },

     change: {
       resize: {
         start: function() {
           var el = this.element;
           this.origSize = { width: el.width(), height: el.height() };
           this.origPos = el.position();
         },

         drag: function(ev, dx, dy, data) {
           var op = this.origPos;

           this.element.css({
             top: (data.top === undefined) ? op.top : data.top,
             left: (data.left === undefined) ? op.left : data.left,
             width: data.width,
             height: data.height
           });
         },

         n: function(ev, dx, dy) {
           return { top: this.origPos.top + dy, height: this.origSize.height - dy };
         },

         e: function(ev, dx, dy) {
           return { width: this.origSize.width + dx };
         },

         s: function(ev, dx, dy) {
           return { height: this.origSize.height + dy };
         },

         w: function(ev, dx, dy) {
           return { left: this.origPos.left + dx, width: this.origSize.width - dx };
         },

         ne: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.n.call(this, ev, dx, dy), base.e.call(this, ev, dx, dy));
         },

         se: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.s.call(this, ev, dx, dy), base.e.call(this, ev, dx, dy));
         },

         sw: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.s.call(this, ev, dx, dy), base.w.call(this, ev, dx, dy));
         },

         nw: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.n.call(this, ev, dx, dy), base.w.call(this, ev, dx, dy));
         }
       },

       rotate: {
         start: function() {
           this.origRotate = parseInt(this.element.css('rotate') || 0);
         },

         drag: function(ev, dx, dy, data) {
           console.log('drag!', dx, dy, data);
           this.element.transform({ rotate: (data % 360) + 'deg' });
         },

         ne: function(ev, dx, dy) {
           return this.origRotate + dx;
         },

         se: function(ev, dx, dy) {
           return this.origRotate - dx;
         },

         sw: function(ev, dx, dy) {
           return this.origRotate - dx;
         },

         nw: function(ev, dx, dy) {
           return this.origRotate + dx;
         }
       },

       skew: {
         start: function() {
           this.origSkewX = parseInt(this.element.css('skewX') || 0);
           this.origSkewY = parseInt(this.element.css('skewY') || 0);
         },

         drag: function(ev, dx, dy, data) {
           this.element.transform({
             skewX: this.origSkewX + (data.x || 0) + 'deg',
             skewY: this.origSkewY + (data.y || 0) + 'deg'
           });
         },

         n: function(ev, dx, dy) {
           return { y: dy };
         },

         e: function(ev, dx, dy) {
           return { x: dx };
         },

         s: function(ev, dx, dy) {
           return { y: -1 * dy };
         },

         w: function(ev, dx, dy) {
           return { x: -1 * dx };
         },

         ne: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.n.call(this, ev, dx, dy), base.e.call(this, ev, dx, dy));
         },

         se: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.s.call(this, ev, dx, dy), base.e.call(this, ev, dx, dy));
         },

         sw: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.s.call(this, ev, dx, dy), base.w.call(this, ev, dx, dy));
         },

         nw: function(ev, dx, dy) {
           var base = this.change[this.mode];
           return $.extend(base.n.call(this, ev, dx, dy), base.w.call(this, ev, dx, dy));
         }
       }
     }

   });

})(jQuery);