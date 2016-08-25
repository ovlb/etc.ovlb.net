const headerEl = document.querySelector('.js-main-header');
const contentEl = document.querySelector('.js-main-content');

 /**
  * Returns a function, that, as long as it continues to be invoked, will not
  * be triggered. The function will be called after it stops being called for
  * N milliseconds. If `immediate` is passed, trigger the function on the
  * leading edge, instead of the trailing.
  *
  * @param {String} func – The function to execute
  * @param {String} wait – The time that shall pass before the function call
  * @param {Boolean} immediate – Whether or not the function shall be called
  *                              immediately
  */
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

var activateEventListeners = () => {
  document.addEventListener('scroll', debounceChangeHeader);
};


/**
 * Controls the header on scroll
 */
var controlHeader = () => {
  const cssClass = 'o-main-header--scrolled';
  var offsetToScroll = contentEl.offsetTop;
  var scrollOffsetY = window.pageYOffset ||
    document.documentElement.scrollTop;
  var headerHeight = headerEl.clientHeight;

  if (scrollOffsetY > offsetToScroll && !headerEl.classList.contains(cssClass)) {
    headerEl.classList.add(cssClass);
  } else if (scrollOffsetY < offsetToScroll && headerEl.classList.contains(cssClass)) {
    headerEl.classList.remove(cssClass);
  }
}

var debounceChangeHeader =  debounce(function(){
  controlHeader();
}, 40);

(() => {
  console.log('im');
  activateEventListeners();
})();
