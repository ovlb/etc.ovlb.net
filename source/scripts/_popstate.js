class CustomNavigator {
  constructor() {
    // Classes
    this.indexClass = 'js-is-index';
    this.articleClass = 'js-is-article';

    // Elements
    this.mainContentEl = document.querySelector('.js-main-content');
    this.articleHeaderEl = document.querySelector('.js-article-header');
    this.articleContentEl = document.querySelector('.js-article-content');

    this.articles = document.querySelectorAll('.js-article');
    this.links = document.querySelectorAll('a');
    console.log(this.links);

    // Bind methods
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.createEl = this.createEl.bind(this);
    this.renderView = this.renderView.bind(this);
    this.renderArticle = this.renderArticle.bind(this);

    // Call common methods
    this.addEventListeners();
  }

  addEventListeners() {
    for ( var i = 0; i < this.links.length; i++ ) {
      const link = this.links[i];
      link.addEventListener('click', (e) => {
        this.handleLinkClick(e);
      }, false)
    }

    window.addEventListener('popstate', (e) => {
      console.log(e);
    });
  }

  /**
   * Handle a click, get data, render view
   *
   * @param {Event} e -
   */
  handleLinkClick(e) {
    e.preventDefault();
    const target = e.target;
    // AJAX request to get the article data
    get(target).then( (response) => {
        const data = JSON.parse(response);
        console.log(data);
        history.pushState(data, null, target);
        this.renderView(data);
        e.stopPropagation();
      }, (error) => {
        console.log('Error: ' + response);
      } );
  }

  /**
   * Creates a new element, adds classes and appends it to a parent element or
   * returns it for further reference
   *
   * @param {String} dEl - The element to be created
   * @param {String|Array} dClasses - Classes that will be added, if it is an array
   *                                loop through, if it is a string, just adds the
   *                                class
   * @param {Node} dParent - Parent element that the newEl should be appended to. If
   *                       it is false, return the element instead.
   *
   * @returns - The created element
   */
  createEl(dEl, dClasses, dContent, dParent) {
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

    //return newEl;

    if ( dParent ) {
      dParent.appendChild(newEl);
    } else {
      return newEl;
    }
  }

  /**
   * Switch to handle common parts of the view rendering
   *
   * @param {Object} data -
   */
  renderView( data ) {
    var content;
    // Reset content area
    this.mainContentEl.innerHTML = '';

    if ( data.title === 'Start' ) {
      this.renderIndex( data );
    } else {
      this.mainContentEl.classList.remove(this.indexClass);
      this.mainContentEl.classList.remove('o-archive');
      this.mainContentEl.classList.add(this.articleClass);
      this.renderArticle( data );
    }

    document.title = data.title + ' | etc.ovlb';
  }

  /**
   * Render the cards on the index page
   *
   * @param {Object} data - Data to be parsed, a JSON object returned from the
   * server
   */
  renderIndex( data ) {
    const articles = data.artikel;

    for ( var i = 0; i < articles.length; i++) {
      const article = articles[i];
      const headline = article.title;
      const abstract = article.abstract;
      const type = article.type;
      const date = article.date;
      const slug = article.slug;

      const newCardEL = this.createEl('article', ['o-card', 'a--above__parent', 'js-article'], false, false);
      newCardEL.setAttribute('data-slug', slug);

      // Create the link, link it, append it
      const cardLink = this.createEl('a', 'a--above', false, false);
      cardLink.setAttribute('href', '/' + slug);
      newCardEL.appendChild(cardLink);

      // headline
      const newCardHeader = this.createEl('header', 'c-card__header', false, false);
      const headLineText = document.createTextNode(headline);
      this.createEl('h2', ['c-sub-headline', 'c-card__headline'], headLineText, newCardHeader);
      newCardEL.appendChild(newCardHeader);

      // abstract
      const abstractText = document.createTextNode(abstract);
      this.createEl('p', 'c-card__abstract', abstractText, newCardEL);

      // meta
      const newCardFooter = this.createEl('footer', 'c-card__footer', false, false);
      const metaNode = document.createTextNode(type + '—' + date);
      this.createEl('p', ['p--small', 'c-card__meta'], metaNode, newCardFooter);
      newCardEL.appendChild(newCardFooter);

      // append the whole Node
      this.mainContentEl.appendChild(newCardEL);
    }
  }

  toggleClasses( site ) {
    // TO DO now it is weekend
  }

  /**
   * Renders a single article
   *
   * @param {Object} data - The data which should be parsed in the content
   * area
   */
  renderArticle( data ) {
    let newArticleHeaderEl = this.createEl('header', ['o-article-header', 'o-article-header--hidden'], false, false);

    const articleType = data.article.type;
    const articleDate = data.article.date;
    let articleMeta = document.createTextNode(articleType + '—' + articleDate);

    this.createEl('p', ['c-card__meta', 'p--small'], articleMeta, newArticleHeaderEl);

    let newArticleHeading = document.createTextNode(data.article.title);
    this.createEl('h1', 'c-main-headline', newArticleHeading, newArticleHeaderEl);

    if( data.article.subtitle ) {
      let newArticleSubHeading = document.createTextNode(data.article.subtitle);
      this.createEl('h2', 'c-sub-headline', newArticleSubHeading, newArticleHeaderEl);
    }

    let newArticleContentEl = this.createEl('section', ['o-article__content', 'o-article__content--hidden'], false, false);
    const newArticleContent = data.text;
    newArticleContentEl.innerHTML = newArticleContent;

    this.mainContentEl.classList.add('o-article');
    this.mainContentEl.appendChild(newArticleHeaderEl);
    this.mainContentEl.appendChild(newArticleContentEl);

    setTimeout( () => {
      newArticleHeaderEl.classList.remove('o-article-header--hidden');
      newArticleContentEl.classList.remove('o-article__content--hidden');
    }, 200);
  }
}

// Initiate
new CustomNavigator();
