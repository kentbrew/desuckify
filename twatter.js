// Twatter, by Kent Brewster
// https://github.com/kentbrew/twatter
// Remember when you could roll your own Twitter timelines? You still can.

(function (w, d, a) {
  var $ = w[a.k] = {
    'w': w,
    'd': d,
    'a': a,
    'v': {'css': ''},
    'f': (function () {
      return {
        newLink: function (href, innerHTML) {
          var a = $.d.createElement('A');
          a.href = href;
          a.innerHTML = innerHTML;
          return a;
        },
        ping: function (r) {
          var s = $.d.getElementById($.a.k + '_ping');
          s.parentNode.removeChild(s);
          if (r.body) {  
            // we have an HTML fragment; render it and let the DOM sort things out        
            var temp = $.d.createElement('SPAN');
            temp.innerHTML = r.body;

            // master tweet list
            var ol = temp.getElementsByTagName('OL')[0];
            
            // tweets
            var li = ol.getElementsByTagName('LI');
            for (var i = 0; i < li.length; i = i + 1) {
            
              // some list items belong to sublists; don't use them
              if (li[i].parentNode === ol) {
              
                // tweet head
                var hd = li[i].getElementsByTagName('DIV')[0];
                var a = hd.getElementsByTagName('A');
                for (var n = a.length - 1, j = n; j > -1; j = j - 1) {
                  var scribe = a[j].getAttribute('data-scribe'); 
                  switch(scribe) {

                    case 'element:user_link':

                      // avatar
                      var img = a[j].getElementsByTagName('IMG')[0];
                      var avatarLink = $.d.createElement('A');
                      
                      avatarLink.className = $.a.k + '_avatarLink';
                      avatarLink.href = a[j].href;
                      avatarLink.target = '_blank';
                      var avatarImage = $.d.createElement('IMG');
                      avatarImage.className = $.a.k + '_avatarImage';
                      avatarImage.src = img.src;
                      avatarLink.appendChild(avatarImage);
                      
                      // name, nick, and link
                      var spans = a[j].getElementsByTagName('SPAN');
                      var nameLink = $.d.createElement('A');
                      nameLink.className = $.a.k + '_nameLink';
                      var name = $.d.createElement('SPAN');
                      name.innerHTML = spans[0].innerHTML;
                      nameLink.appendChild(name);
                      nameLink.appendChild($.d.createTextNode('@' + a[j].href.split('/').pop()));
                      nameLink.href = a[j].href;

                    break;

                    case 'element:mini_timestamp':

                      // link timestamp to individual status page
                      var timeLink = $.d.createElement('A');
                      timeLink.className = $.a.k + '_timeLink';
                      timeLink.innerHTML = a[j].innerHTML;
                      timeLink.href = a[j].href;
                      timeLink.target = '_blank';

                    break;
                  } 
                }
                
                // tweet body
                
                var p = li[i].getElementsByTagName('P')[0];
                
                var a = p.getElementsByTagName('A');
                for (var n = a.length - 1, j = n; j > -1; j = j - 1) {
                  var scribe = a[j].getAttribute('data-scribe');   
                  switch(scribe) {
                    case 'element:url':
                      p.insertBefore($.f.newLink(a[j].title, a[j].title.split('/')[2]), a[j]);
                      break;
                    case 'element:mention':
                      p.insertBefore($.f.newLink(a[j].href, '@' + a[j].getElementsByTagName('B')[0].innerHTML), a[j]);
                      break;
                    case 'element:hashtag':
                      p.insertBefore($.f.newLink(a[j].href, '#' + a[j].getElementsByTagName('B')[0].innerHTML), a[j]);
                      break;
                    default:  
                  }                             
                }
                var a = p.getElementsByTagName('A');
                for (var n = a.length - 1, j = n; j > -1; j = j - 1) {
                  var scribe = a[j].getAttribute('data-scribe');
                  var embed = a[j].getAttribute('data-pre-embedded');
                  if (scribe || embed) {
                    p.removeChild(a[j]);
                  }
                }                
                var span = $.d.createElement('SPAN');
                span.className = 'content';
                span.innerHTML = p.innerHTML;
                var out = $.d.createElement('LI');
                out.className = $.a.k + '_item';
                out.appendChild(avatarLink);
                var container = $.d.createElement('SPAN');
                container.appendChild(nameLink);
                container.appendChild(span);
                container.appendChild(timeLink);
                out.appendChild(container);
                $.s.appendChild(out);
              }

            }
          }
        },
        makeStyleFrom: function (obj, str) {
          // make CSS rules
          var name, i, k, pad, rules = '', selector = str || '';
          for (k in obj) {
            if (obj[k].hasOwnProperty) {
              // found a rule
              if (typeof obj[k] === 'string') {
                rules = rules + k + ': ' + obj[k] + '!important; ';
              }
            }
          }
          // add selector and rules to stylesheet
          if (selector && rules) {
            $.v.css = $.v.css + selector + ' { ' + rules + '}\n';
          }
          // any children we need to handle?
          for (k in obj) {
            if (obj[k].hasOwnProperty) {
              if (typeof obj[k] === 'object') {
                // found a selector
                name = k.split(', ');
                // handle multiple selector names
                for (i = 0; i < name.length; i = i + 1) {
                  pad = '';
                  // & means "add this to my parent selector"
                  if (name[i].match(/^&/)) {
                    name[i] = name[i].split('&')[1];
                  } else {
                    if (selector) {
                      pad = ' ';
                    }
                  }
                  // beat until stiff
                  $.f.makeStyleFrom(obj[k], selector + pad + name[i].replace(/^\s+|\s+$/g,""));
                }
              }
            }
          }
        },
        // build stylesheet
        presentation : function (rules) {
          var css, rules;
          css = $.d.createElement('STYLE');
          css.type = 'text/css';
          // each rule has our key at its root to minimize style collisions
          rules = rules.replace(/#_/g, '#' + a.k + '_');
          rules = rules.replace(/\._/g, '.' + a.k + '_');
          // add rules to stylesheet
          if (css.styleSheet) {
            css.styleSheet.cssText = rules;
          } else {
            css.appendChild($.d.createTextNode(rules));
          }
          // add stylesheet to page
          if ($.d.h) {
            $.d.h.appendChild(css);
          } else {
            $.d.b.appendChild(css);
          }
        },
        structure: function (script) {
          var widgetId = script.getAttribute('data-widget-id');
          var structureId = script.getAttribute('data-structure-id');
          if (widgetId && structureId) {
            $.s = $.d.getElementById(structureId);
            if ($.s) {
              $.s.id = $.a.k + '_list';
              var s = $.d.createElement('SCRIPT');
              s.setAttribute('charset', 'utf-8');
              s.id = $.a.k + '_ping';
              s.src = $.a.endpoint + widgetId + '?callback=' + $.a.k + '.f.ping';
              $.d.b.appendChild(s);
            }    
          }
        },
        init : function () {
          $.d.h = $.d.getElementsByTagName('HEAD')[0];
          $.d.b = $.d.getElementsByTagName('BODY')[0];
          var script = $.d.getElementsByTagName('SCRIPT'), n = script.length, i;
          for (i = 0; i < n; i = i + 1) {
            if (script[i].src && script[i].src.match($.a.me)) {
              $.f.structure(script[i]);
              $.f.makeStyleFrom($.a.rules);
              $.f.presentation($.v.css);
              script[i].parentNode.removeChild(script[i]);
              break;
            }
          }
        }
      };
    }())
  };
  $.f.init();
}(window, document, {
  'k': 'TW_' + new Date().getTime(),
  'me': 'twatter.js',
  'strip': [
    'className', 'rel', 'dir', 'data-expanded-url', 'target', 'title', 'data-scribe'
  ],
  'endpoint': 'https://cdn.syndication.twimg.com/widgets/timelines/',
  'rules': {
    'ul#_list' : {
      'white-space': 'normal',
      'box-shadow': '0 0 10px #000',
      'width': '510px',
      'height': '600px',
      'overflow': 'auto',
      'margin': '0',
      'padding': '0',
      'color': '#000',
      'background': '#fff',
      '*': {
        'box-sizing': 'border-box',
        '-moz-box-sizing': 'border-box',
        '-ms-box-sizing': 'border-box'
      },
      'li._item': {
        'list-style': 'none',
        'font-family': '"Helvetica Neue", sans-serif',
        'margin': '0',
        'overflow': 'auto',
        'width': '100%',
        'border-bottom': '1px solid #eee',
        'font-size': '14px',
        'padding': '10px 10px 10px 65px',
        'position': 'relative',
        'a': {
          'text-decoration': 'none',
          '&::hover': {
            'text-decoration': 'underline'
          }
        },
        'a._avatarLink': {
          'position': 'absolute',
          'top': '10px',
          'left': '10px',
          'img._avatarImage': {
            'border-radius': '5px',
            'overflow': 'hidden'
          }
        },
        'a._nameLink, a._timeLink': {
          'display': 'block'
        },
        'a._timeLink': {
          'font-size': '12px'
        }             
      }
    }
  }
}));
