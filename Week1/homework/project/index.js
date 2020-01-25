'use strict';

{


  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {

    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, ul) {
    createAndAppend('li', ul, {
      text: repo.name,
    });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        //to add header when it gives the error
        const header = createAndAppend('div', root);
        header.classList.add('main-header');
        createAndAppend('p', header, {
          text: 'HYF Repositories',
        });
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      const header = createAndAppend('div', root);
      header.classList.add('main-header');
      createAndAppend('p', header, {
        text: 'HYF Repositories',
      });
      const ul = createAndAppend('ul', root);
      // repos.forEach(repo => renderRepoDetails(repo, ul));
      repos
        .sort((a, b) => {
          let A = a.name.toUpperCase();
          let B = b.name.toUpperCase();
          // we can order it with locale compare 
          // return A.localeCompare(B);
          if (A < B) {
            return -1;
          }
          if (A > B) {
            return 1;
          }
          return 0;
        })
        .forEach(repo => addRepo(repo, ul));

    });
  }

  function addRepo(repo, ul) {
    const list = document.createElement('ul');
    list.classList.add('style-list')
    list.innerHTML = `
      <li><div class="heads">Repository:</div><div class='repos'>${repo.name}</div></li>
      <li><div class="heads">Description:</div><div class='repos'>${repo.description}</div></li>
      <li><div class="heads">Forks:</div><div class='repos'>${repo.forks}</div></li>
      <li><div class="heads">Updated:</div><div class='repos'>${repo.updated_at}</div></li>
    `;
    ul.appendChild(list);
  }



  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
  window.onload = () => main(HYF_REPOS_URL);
}
