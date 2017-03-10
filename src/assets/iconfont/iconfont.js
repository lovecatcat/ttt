;
(function (window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-qiehuanqiyou" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M881.298746 520.342595 398.119373 0 175.112486 0 658.29178 520.342595 175.112507 1003.504117l223.006914 0L881.298746 520.342595z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-qiehuanqizuo" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M658.29178 1003.504117l223.006914 0L398.119373 520.342595 881.298746 0 658.291782 0 175.112507 520.342595 658.29178 1003.504117z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-add" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M852.864 178.432c-187.904-187.52-492.096-187.328-679.744 0.448-187.584 187.84-187.392 492.032 0.384 679.808 187.84 187.52 492.224 187.264 679.744-0.576C1040.768 670.272 1040.768 366.016 852.864 178.432zM747.328 565.504l-197.12 0.32 0 197.632c0 20.352-16.448 37.056-36.864 37.184-20.48 0-36.992-16.704-36.992-37.056L476.352 565.888 278.848 566.144c-20.416 0-36.992-16.512-36.992-36.928 0-20.352 16.576-37.056 36.992-37.056l197.376-0.256L476.224 295.168c0-20.48 16.512-37.184 36.992-37.184S550.144 274.56 550.144 295.04l0 196.864 197.056-0.192c20.416 0 37.056 16.512 37.056 36.928C784.32 548.992 767.744 565.504 747.328 565.504z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-bofang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 0.01536c-282.745711 0-511.99232 229.246609-511.99232 511.99232 0 282.766191 229.246609 511.99232 511.99232 511.99232s511.99232-229.22613 511.99232-511.99232C1023.99232 229.261969 794.745711 0.01536 512 0.01536zM725.287809 541.48615 414.480823 718.42148c-28.499541 16.217869-51.812599 2.948052-51.812599-29.499974L362.668224 335.093854c0-32.448025 23.313058-45.717842 51.812599-29.499974l310.806986 176.924066C753.787349 498.736839 753.787349 525.278521 725.287809 541.48615z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-guanbi2" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128.287273c-211.584464 0-383.712727 172.128262-383.712727 383.712727 0 211.551781 172.128262 383.712727 383.712727 383.712727 211.551781 0 383.712727-172.159226 383.712727-383.712727C895.712727 300.415536 723.551781 128.287273 512 128.287273z"  ></path>' +
    '' +
    '<path d="M557.05545 513.376159l138.367639-136.864185c12.576374-12.416396 12.672705-32.671738 0.25631-45.248112s-32.704421-12.672705-45.248112-0.25631l-138.560301 137.024163-136.447897-136.864185c-12.512727-12.512727-32.735385-12.576374-45.248112-0.063647-12.512727 12.480043-12.54369 32.735385-0.063647 45.248112l136.255235 136.671523-137.376804 135.904314c-12.576374 12.447359-12.672705 32.671738-0.25631 45.248112 6.271845 6.335493 14.496116 9.504099 22.751351 9.504099 8.12794 0 16.25588-3.103239 22.496761-9.247789l137.567746-136.064292 138.687596 139.136568c6.240882 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.591372-9.34412 12.512727-12.480043 12.54369-32.704421 0.063647-45.248112L557.05545 513.376159z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function () {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function (fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function () {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function () {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function () {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function () {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function (el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function (el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)

