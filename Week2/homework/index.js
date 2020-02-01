'use strict';

{

  //define our main divs
  const mainContainer = document.querySelector('.main-container');
  const repoContainer = document.querySelector('.repo-container');
  const contributorContainer = document.querySelector('.contributors-container');
  const selector = document.getElementById('selector');

  //making api with fetch method.
  // ı have used async, await methods in this fetch

  const fetchJSON = async () => {

    const response = await fetch(HYF_REPOS_URL);
    if (response.status !== 200) {
      throw new Error('can not fetch the data')
    }
    const data = await response.json();
    return data;
  };
  //standard creating function
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
  //using index to be able to add option's valuet to index numbers
  function renderRepoDetails(repo, selector, index) {
    createAndAppend('option', selector, {
      text: repo.name,
      value: index
    });
    //when open the page this shows first content of selects dive
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
        //to make selectors dive
        repos.forEach((repo, index) => renderRepoDetails(repo, selector, index));
        //to change the page when selecting of option
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
  }
  //to add contributors div
  function addContribution(repo) {

    createAndAppend('h1', contributorContainer, {
      text: 'Contributions',
    })
    contributorContainer.innerText = '';
    const ul = createAndAppend('ul', contributorContainer);
    ul.classList.add('list');
    //fetchind data from contributors_url of selected repo
    // ı have used then method in this fetch
    fetch(repo.contributors_url)
      .then(response => response.json())
      .then(data =>
        // to show all the contributors we've used for each to iterate
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
  //to add repositories dives
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
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}

