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
    return await response.json();
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
    if (index == '0') {
      addRepo(repo);
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
              addRepo(repo);
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
  function addRepo(repo) {
    const repoList = document.createElement('table');
    repoList.classList.add('style-list')
    const newTime = new Date(repo.updated_at).toLocaleString()
    repoContainer.innerText = '';

    const th = createAndAppend("tr", repoList);
    createAndAppend('td', th, { text: 'Repository :' });
    const tdmain = createAndAppend('td', th);
    createAndAppend('a', tdmain, {
      text: repo.name,
      href: repo.html_url
    })
    const tr1 = createAndAppend("tr", repoList);
    createAndAppend('td', tr1, { text: 'Description :' });
    createAndAppend('td', tr1, { text: repo.description });
    const tr2 = createAndAppend("tr", repoList);
    createAndAppend('td', tr2, { text: 'Forks :' });
    createAndAppend('td', tr2, { text: repo.forks });
    const tr3 = createAndAppend("tr", repoList);
    createAndAppend('td', tr3, { text: 'Updated :' });
    createAndAppend('td', tr3, { text: newTime });

    repoContainer.appendChild(repoList);
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}

