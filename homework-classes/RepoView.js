'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      // TODO: replace this comment and the console.log with your own code
      const newTime = new Date(repo.updated_at).toLocaleString()
      this.container.innerText = '';
      const table = createAndAppend('table', this.container);

      table.innerHTML += `
        <tr>
          <td>Repository:</td>
          <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
        </tr>
        <tr>
          <td>Description:</td>
          <td>${repo.description}</td>
        </tr>
        <tr>
          <td>Forks:</td>
          <td>${repo.forks}</td>
        </tr>
        <tr>
          <td>Updated:</td>
          <td>${newTime}</td>
        </tr>
      `;

      console.log('RepoView', repo);
    }
  }

  window.RepoView = RepoView;
}
