'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      // TODO: replace this comment and the console.log with your own code
      createAndAppend('h1', this.container, {
        text: 'Contributions',
      })
      this.container.innerText = '';
      const ul = createAndAppend('ul', this.container);

      contributors.forEach(contributor => {
        const li = createAndAppend("li", ul);
        createAndAppend("img", li, {
          src: contributor.avatar_url
        });
        createAndAppend("a", li, {
          text: contributor.login,
          href: contributor.html_url,
          target: "_blank"
        });
        createAndAppend("span", li, {
          text: contributor.contributions
        });
      })


      console.log('ContributorsView', contributors);
    }
  }

  window.ContributorsView = ContributorsView;
}
