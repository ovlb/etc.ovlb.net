const indexClass = 'js-is-index';
const articleClass = 'js-is-article';

if ( contentEl.classList.contains(articleClass) ) {
  const articleHeader = document.querySelector('js-article-header');
  const articleContent = document.querySelector('js-article-content');
} else if ( contentEl.classList.contains(indexClass) ) {
  const articles = document.querySelectorAll('js-article');

  contentEl.addEventListener('click', function(event) {
    if ( event.target != event.currentTarget) {
      event.preventDefault();
      // parentNode as the event target is the link, not the box itself
      const slug = event.target.parentNode.getAttribute('data-slug');

      get(slug).then( (response) => {
        const data = response;
        console.log(response);
        history.pushState(data, null, slug);
        renderPage(data);
        contentEl.classList.remove(indexClass);
        contentEl.classList.remove('o-archive');
        document.title = response.title + ' | etc.ovlb';
        contentEl.classList.add(articleClass);
      }, (error) => {
        console.log('Error: ' + response);
      } );
    }
    event.stopPropagation();
  }, false);
}

var renderPage = (data) => {
  contentEl.innerHTML = data;
}
