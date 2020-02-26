'use strict';

{
  //to define amount of fetched repositories dynamically I create base and query vaiable
  const base = 'https://api.github.com/orgs/HackYourFuture/repos';


  //define our main divs
  const mainContainer = document.querySelector('.main-container');
  const repoContainer = document.querySelector('.repo-container');
  const contributorContainer = document.querySelector('.contributors-container');
  const selector = document.getElementById('selector');

  //making api with axios method.
  //week 3
  // ı have used async, await methods and try and catch in this axios method

  const fetchJSON = async (repositoriesAmount) => {
    try {
      //to define amount of fetched repositories dynamically I create base and query vaiable and concatenate them in HYF_REPOS_URL
      const query = `?per_page=${repositoriesAmount}`
      const HYF_REPOS_URL = base + query;
      const response = await axios.get(HYF_REPOS_URL);
      const data = response.data;
      return data;
    } catch (error) {
      errorHandler(error)
    }
  };

  function errorHandler(error) {
    mainContainer.style.display = 'none';
    createAndAppend('div', root, {
      text: error.response.status + error.response.statusText,
      class: 'alert-error',
    });
    console.log(error.response);
  }

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
  //week 3 make it async await and try and catch
  async function main() {
    ////to define amount of fetched repositories dynamically I called function in here with wanted repositories amount.
    const repos = await fetchJSON(100)
    repos.sort((a, b) => {
      const firstRepo = a.name.toUpperCase();
      const secondRepo = b.name.toUpperCase();
      // we can order it with locale compare 
      return firstRepo.localeCompare(secondRepo);
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

  }
  //to add contributors div
  //week 3
  //write funct async and add try and catch
  async function addContribution(repo) {

    createAndAppend('h1', contributorContainer, {
      text: 'Contributions',
    })
    contributorContainer.innerText = '';
    const ul = createAndAppend('ul', contributorContainer);
    ul.classList.add('list');
    //fetchind data from contributors_url of selected repo
    // ı have used then method in this axios
    try {
      const response = await axios.get(repo.contributors_url)
      // to show all the contributors we've used for each to iterate
      response.data.forEach(item => {
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
    } catch (error) {
      console.log(error)
      //ı have added error handling here
      errorHandler(error);
    }


  }
  //to add repositories dives
  function addRepo(repo, repoContainer) {
    const repoList = document.createElement('table');
    repoList.classList.add('style-list')
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

