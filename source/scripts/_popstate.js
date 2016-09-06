const indexClass = 'js-is-index';
const articleClass = 'js-is-article';

if ( contentEl.classList.contains(articleClass) ) {
  const articleHeader = document.querySelector('js-article-header');
  const articleContent = document.querySelector('js-article-content');
} else if ( contentEl.classList.contains(indexClass) ) {
  const articles = document.querySelectorAll('js-article');

  contentEl.addEventListener('click', function(event) {
    if ( event.target != event.currentTarget ) {
      event.preventDefault();
      // parentNode as the event target is the link, not the box itself
      const slug = event.target.parentNode.getAttribute('data-slug');

      // AJAX request to get the article data
      get(slug).then( (response) => {
        const data = JSON.parse(response);
        history.pushState(data, null, slug);
        renderArticle(data);
        contentEl.classList.remove(indexClass);
        contentEl.classList.remove('o-archive');
        document.title = data.title + ' | etc.ovlb';
        contentEl.classList.add(articleClass);
      }, (error) => {
        console.log('Error: ' + response);
      } );
    }
    event.stopPropagation();
  }, false);
}

var renderArticle = (data) => {
  let newArticleHeaderEl = document.createElement('header');
  newArticleHeaderEl.classList.add('o-article-header');
  let newArticleMetaEl = document.createElement('p');

  let articleType = data.article.type;
  let articleDate = data.article.date;
  let articleMeta = document.createTextNode(articleType + '—' + articleDate);
  newArticleMetaEl.classList.add('c-card__meta', 'p--small');
  newArticleMetaEl.appendChild(articleMeta);
  newArticleHeaderEl.appendChild(newArticleMetaEl);

  let newArticleHeadingEl = document.createElement('h1');
  newArticleHeadingEl.classList.add('c-main-headline');
  let newArticleHeading = document.createTextNode(data.article.title);
  newArticleHeadingEl.appendChild(newArticleHeading);
  newArticleHeaderEl.appendChild(newArticleHeadingEl);

  if(data.article.subtitle) {
    let newArticleSubHeadingEl = document.createElement('h2');
    newArticleSubHeadingEl.classList.add('c-sub-headline');
    let newArticleSubHeading = document.createTextNode(data.article.subtitle);
    newArticleSubHeadingEl.appendChild(newArticleSubHeading);
    newArticleHeaderEl.appendChild(newArticleSubHeadingEl);
  }

  let newArticleContentEl = document.createElement('section');
  newArticleContentEl.classList.add('o-article');
  newArticleContentEl.innerHTML = data.text;

  contentEl.innerHTML = '';
  contentEl.appendChild(newArticleHeaderEl);
  contentEl.appendChild(newArticleContentEl);
}
