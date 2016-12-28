class CustomNavigator {
  constructor() {
    // Classes
    this.indexClass = 'o-archive';
    this.singleArticleClass = 'o-article';
    this.indexJsHook = 'js-is-index';
    this.articleJsHook = 'js-is-article';

    // Elements
    this.mainContentEl = document.querySelector('.js-main-content');
    this.articleHeaderEl = document.querySelector('.js-article-header');
    this.articleContentEl = document.querySelector('.js-article-content');
    this.articles = document.querySelectorAll('.js-article');

    /**!!!!!!
     *
     *  Refine to only include links on page
     *
     !!!!! */
    this.links = document.querySelectorAll('a');

    this.lastScroll = 0;

    // Bind methods
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.saveScrollPosition = this.saveScrollPosition.bind(this);
    this.getState = this.getState.bind(this);
    this.createEl = this.createEl.bind(this);
    this.renderView = this.renderView.bind(this);
    this.toggleClasses = this.toggleClasses.bind(this);
    this.renderArticle = this.renderArticle.bind(this);

    // Call common methods
    this.addEventListeners();
  }

  addEventListeners() {
    this.links = document.querySelectorAll('a');

    for ( var i = 0; i < this.links.length; i++ ) {
      const link = this.links[i];
      link.addEventListener('click', this.handleLinkClick, false)
    }

    window.addEventListener('popstate', this.handleLinkClick, false);
  }

  removeEventListeners() {
    for ( var i = 0; i < this.links.length; i++ ) {
      const link = this.links[i];
      link.removeEventListener('click', this.handleLinkClick);
    }
  }

  /**
   * Handle a click, get data, render view
   *
   * @param {Event} e -
   */
  handleLinkClick(e) {
    if ( !('Promise' in window) ) {
      return;
    }
    this.removeEventListeners();
    e.preventDefault();

    const isIndex = this.getState();

    if(isIndex) {
      this.saveScrollPosition();
    }

    let target;
    if ( e.type === 'click' ) {
      target = e.target;
    } else if ( e.type === 'popstate' ) {
      target = location.pathname.replace('/', '');
    }

    // AJAX request to get the article data
    get( target ).then( (response) => {
        const data = JSON.parse(response);
        // Only push a state if the user clicked a link
        if ( e.type === 'click' ) {
          history.pushState(data, null, target);
        }
        this.renderView(data);
        e.stopPropagation();
      }, (error) => {
        console.error('Error: ' + response);
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
      window.scrollTo(0,this.lastScroll);
      this.toggleClasses( 'index' );
      this.renderIndex( data );
      this.addEventListeners();
    } else {
      window.scrollTo(0,0);
      this.toggleClasses( 'article' );
      this.renderArticle( data );
      this.addEventListeners();
    }

    document.title = data.title + ' | etc.ovlb';
  }

  saveScrollPosition() {
    const offsetY = window.pageYOffset || document.documentElement.scrollTop;
    this.lastScroll = offsetY;

    return;
  }

  getState() {
    const mainClassList = this.mainContentEl.classList;
    const stateIsIndex = mainClassList.contains(this.indexJsHook);

    return stateIsIndex;
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

      // Create the Node
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

  /**
   * Control classes to correctly display the content
   */
  toggleClasses( site ) {
    const mainClassList = this.mainContentEl.classList;
    const stateIsIndex = mainClassList.contains(this.indexJsHook);
    const stateIsArticle = mainClassList.contains(this.articleJsHook);

    // Requested site is
    if( site === 'index' && stateIsIndex) {
      // No need to do anything
      return;
    } else if( site === 'index' && stateIsArticle) {
      mainClassList.remove(this.articleJsHook);
      mainClassList.remove(this.singleArticleClass);
      mainClassList.add(this.indexJsHook);
      mainClassList.add(this.indexClass);
    }

    if ( site === 'article' && stateIsArticle) {
      return;
    } else if( site === 'article' && stateIsIndex) {
      mainClassList.remove(this.indexJsHook);
      mainClassList.remove(this.indexClass);
      mainClassList.add(this.articleJsHook);
      mainClassList.add(this.singleArticleClass);
    }
  }

  /**
   * Renders a single article
   *
   * @param {Object} data - The data which should be parsed in the content
   * area
   */
  renderArticle( data ) {
    const newArticleHeaderEl = this.createEl('header', ['o-article-header', 'o-article-header--hidden'], false, false);

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

    this.mainContentEl.appendChild(newArticleHeaderEl);
    this.mainContentEl.appendChild(newArticleContentEl);

    setTimeout( () => {
      newArticleHeaderEl.classList.remove('o-article-header--hidden');
    }, 180);
    setTimeout( () => {
      newArticleContentEl.classList.remove('o-article__content--hidden');
    }, 230);
  }
}

if ( 'history' in window ) {
  // Initiate
  new CustomNavigator();
}
