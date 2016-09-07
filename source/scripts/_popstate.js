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

/**
 * Creates a new element, adds classes and appends it to a parent element or
 * returns it for further reference
 *
 * @param {String} dEl The element to be created
 * @param {String/Array} dClasses Classes that will be added, if it is an array
 *                                loop through, if it is a string, just adds the
 *                                class
 * @param {Node} dParent Parent element that the newEl should be appended to. If
 *                       it is false, return the element instead.
 */

var createEl = (dEl, dClasses, dContent, dParent) => {
  var newEl = document.createElement(dEl);

  if ( Array.isArray(dClasses) ) {
    for (var index = 0; index < dClasses.length; index++) {
      var cssClass = dClasses[index];
      newEl.classList.add(cssClass);
    }
  } else {
    newEl.classList.add(dClasses);
  }

  if( dContent ) {
    newEl.appendChild( dContent );
  }

  if ( dParent ) {
    dParent.appendChild(newEl);
  } else {
    return newEl;
  }
}

var showContent = (dEl, dClass) => {
  dEl.classList.remove(dClass);
}

var renderArticle = (data) => {
  let newArticleHeaderEl = createEl('header', ['o-article-header', 'o-article-header--hidden'], false, false);

  const articleType = data.article.type;
  const articleDate = data.article.date;
  let articleMeta = document.createTextNode(articleType + '—' + articleDate);

  createEl('p', ['c-card__meta', 'p--small'], articleMeta, newArticleHeaderEl);

  let newArticleHeading = document.createTextNode(data.article.title);
  createEl('h1', 'c-main-headline', newArticleHeading, newArticleHeaderEl);

  if( data.article.subtitle ) {
    let newArticleSubHeading = document.createTextNode(data.article.subtitle);
    createEl('h2', 'c-sub-headline', newArticleSubHeading, newArticleHeaderEl);
  }

  let newArticleContent = data.text;
  let newArticleContentEl = createEl('section', ['o-article', 'o-article--hidden'], false, false);
  newArticleContentEl.innerHTML = newArticleContent;

  contentEl.innerHTML = '';
  contentEl.appendChild(newArticleHeaderEl);
  contentEl.appendChild(newArticleContentEl);

  setTimeout( () => {
    showContent(newArticleHeaderEl, 'o-article-header--hidden');
    showContent(newArticleContentEl, 'o-article--hidden');
  }, 200);
}
