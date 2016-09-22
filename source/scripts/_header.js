var activateEventListeners = () => {
  document.addEventListener('scroll', debounceChangeHeader);
};


/**
 * Controls the header on scroll
 */
var controlHeader = () => {
  console.log('scroll funtion');
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
}, 10);

(() => {
  activateEventListeners();
})();
