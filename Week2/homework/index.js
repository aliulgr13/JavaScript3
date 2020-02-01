'use strict';

{

  // function fetchJSON(url, cb) {
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('GET', url);
  //   xhr.responseType = 'json';
  //   xhr.onload = () => {
  //     if (xhr.status >= 200 && xhr.status <= 299) {
  //       cb(null, xhr.response);
  //     } else {
  //       cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
  //     }
  //   };
  //   xhr.onerror = () => cb(new Error('Network request failed'));
  //   xhr.send();
  // }

  const mainContainer = document.querySelector('.main-container');
  const repoContainer = document.querySelector('.repo-container');
  const contributorContainer = document.querySelector('.contributors-container');
  const selector = document.getElementById('selector');

  const fetchJSON = async () => {

    const response = await fetch(HYF_REPOS_URL);
    if (response.status !== 200) {
      throw new Error('can not fetch the data')
    }
    const data = await response.json();
    return data;
  };

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

  function renderRepoDetails(repo, selector, index) {
    createAndAppend('option', selector, {
      text: repo.name,
      value: index
    });
    if (repo.name === 'alumni') {
      addRepo(repo, repoContainer);
      addContribution(repo)
    }
  }

  function main() {
    fetchJSON()
      .then(repos => {
        repos
          .sort((a, b) => {
            let A = a.name.toUpperCase();
            let B = b.name.toUpperCase();
            // we can order it with locale compare 
            return A.localeCompare(B);
          })
        repos.forEach((repo, index) => renderRepoDetails(repo, selector, index));

        selector.addEventListener('change', (e) => {

          repos.forEach((repo, index) => {
            if (index == e.target.value) {
              addRepo(repo, repoContainer);
              addContribution(repo)
            }
          })
        })
      }).catch(err => {
        mainContainer.style.display = 'none';
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      })

    // fetchJSON(url, (err, repos) => {
    //   const root = document.getElementById('root');
    //   if (err) {
    //     //to add header when it gives the error
    //     const header = createAndAppend('div', root);
    //     header.classList.add('main-header');
    //     createAndAppend('p', header, {
    //       text: 'HYF Repositories',
    //     });
    //     createAndAppend('div', root, {
    //       text: err.message,
    //       class: 'alert-error',
    //     });
    //     return;
    //   }

    //   const header = createAndAppend('div', root);
    //   header.classList.add('main-header');
    //   createAndAppend('p', header, {
    //     text: 'HYF Repositories',
    //   });
    //   const ul = createAndAppend('ul', root);
    //   // repos.forEach(repo => renderRepoDetails(repo, ul));
    //   repos
    //     .sort((a, b) => {
    //       let A = a.name.toUpperCase();
    //       let B = b.name.toUpperCase();
    //       // we can order it with locale compare 
    //       // return A.localeCompare(B);
    //       if (A < B) {
    //         return -1;
    //       }
    //       if (A > B) {
    //         return 1;
    //       }
    //       return 0;
    //     })
    //     .forEach(repo => addRepo(repo, ul));

    // });
  }

  function addContribution(repo) {

    createAndAppend('h1', contributorContainer, {
      text: 'Contributions',
    })
    contributorContainer.innerText = '';
    const ul = createAndAppend('ul', contributorContainer);
    ul.classList.add('list');
    fetch(repo.contributors_url)
      .then(response => response.json())
      .then(data =>
        data.forEach(item => {
          const li = createAndAppend("li", ul);
          createAndAppend("img", li, {
            src: item.avatar_url
          });
          createAndAppend("a", li, {
            text: item.login,
            href: item.html_url,
            target: "_blank"
          });
          createAndAppend("span", li, {
            text: item.contributions
          });
        })
      );
  }

  function addRepo(repo, repoContainer) {
    const repoList = document.createElement('table');
    repoList.classList.add('style-list')
    //repoList.innerText = '';
    const newTime = new Date(repo.updated_at).toLocaleString()
    repoContainer.innerText = '';

    repoList.innerHTML += `
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
    repoContainer.appendChild(repoList);

    // repolist.innerHTML += `
    //   <li><div class="heads">Repository:</div><div class='repos'>${repo.name}</div></li>
    //   <li><div class="heads">Description:</div><div class='repos'>${repo.description}</div></li>
    //   <li><div class="heads">Forks:</div><div class='repos'>${repo.forks}</div></li>
    //   <li><div class="heads">Updated:</div><div class='repos'>${repo.updated_at}</div></li>
    // `;

  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}

