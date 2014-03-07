// presentation for SxSW 2014
(function (w, d, a) {
  var $ = w[a.k] = {
    'w': w, 'd': d, 'a': a, 's': {}, 'v': {'current':{}},
    'f': (function () {
      return {
        kill: function (obj) {
          if (typeof obj === 'string') {
            obj = $.d.getElementById(obj);
          }
          if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
          }
        },
        get: function (el, att) {
          var v = null;
          if (typeof el[att] === 'string') {
            v = el[att];
          } else {
            v = el.getAttribute(att);
          }
          return v;
        },
        set: function (el, att, string) {
          if (typeof el[att] === 'string') {
            el[att] = string;
          } else {
            el.setAttribute(att, string);
          }
        },
        make: function(obj) {
          var el = false, tag, att;
          for (tag in obj) {
            if (obj[tag].hasOwnProperty) {
              el = $.d.createElement(tag);
              for (att in obj[tag]) {
                if (obj[tag][att].hasOwnProperty) {
                  if (typeof obj[tag][att] === 'string') {
                    $.f.set(el, att, obj[tag][att]);
                  }
                }
              }
              break;
            }
          }
          return el;
        },
        listen : function (el, ev, fn) {
          if (typeof $.w.addEventListener !== 'undefined') {
            el.addEventListener(ev, fn, false);
          } else if (typeof $.w.attachEvent !== 'undefined') {
            el.attachEvent('on' + ev, fn);
          }
        },
        click: function (v) {
          var t = v || $.w.event, el = null;
          if (t.target) {
            el = (t.target.nodeType === 3) ? t.target.parentNode : t.target;
          } else {
            el = t.srcElement;
          }
        },
        hide: function () {
          if ($.s.li[$.v.current]) {
            $.s.li[$.v.current].className = 'closed';
          }
        },
        show: function () {
          if ($.s.li[$.v.current]) {
            $.s.li[$.v.current].className = 'open';  
            $.w.location.hash = $.v.current;
          }
        },
        key: {
          up: function () {
          },
          down: function () {
          },
          right: function () {
            $.f.hide();
            $.v.current = $.v.current + 1;
            if ($.v.current >= $.s.li.length) {
              $.v.current = $.s.li.length - 1;
            }
            $.f.show();
         },
         left: function () {
            $.f.hide();
            $.v.current = $.v.current - 1;
            if ($.v.current < 0) {
              $.v.current = 0;
            }
            $.f.show();
          },
          escape: function () {
          },
          enter: function () {
          }
        },
        keydown: function (v) {
          var t = v || $.w.event, el = null, k = t.keyCode || null;
          if (k) {
            var kc = '' + k;
            if ($.a.keyCode[kc] && typeof $.f.key[$.a.keyCode[kc]] === 'function') {
              $.f.key[$.a.keyCode[kc]]();
            }
          }
        },
        hash: function () {
          if ($.w.location.hash.split('#')[1]) {
            var p = $.w.location.hash.split('#')[1] - 0;
            if (p){
              $.f.hide();
              if (p < $.s.li.length) {
                $.v.current = p;
              } else {
                p = $.s.li.length - 1;
              }
              $.v.current = p;
            }
          }
          $.f.show();
        },
        behavior: function () {
          $.f.listen($.d.b, 'click', $.f.click);
          $.f.listen($.d, 'keydown', $.f.keydown);
          $.f.listen($.w, 'hashchange', $.f.hash);
          $.v.current = 0;
          $.f.hash();
        },
        structure: function () {
          $.d.b = $.d.getElementsByTagName('BODY')[0];
          $.s.ul = $.d.getElementById('main');
          $.s.li = [];
          var e = $.d.getElementsByTagName('LI'), i, n = e.length;
          for (i = 0; i < n; i = i + 1) {
            e[i].className = 'closed';
            $.s.li.push(e[i]);
          } 
          $.s.ul.className = '';
        },
        init : function () {
          $.f.structure();
          $.f.behavior();
        }
      };
    }())
  };
  $.f.init();
}(window, document, {
  'k': 'KB_PRESO',
  'keyCode': {
    '13': 'enter',
    '27': 'escape', 
    '37': 'left',
    '38': 'up',
    '39': 'right',
    '40': 'down'
  }
}));