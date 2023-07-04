let currentPage = 1;
const rnmUrlCharacters = "https://rickandmortyapi.com/api/character";
//Change the visible page depending on the global page variable -> make a css class with display:hidden
class rnmChars {
  constructor(url) {
    this.url = url;
    //Replace this.list with a variable, and pass it as an argument
    this.list = document.querySelector(".list-of-chars");
    this.loadedSites = [];
    //When a side being loaded or searched is in the array, look for characters in cache
    //Add number of a page to each cached page
    //Add characters in arrays of 20(so each page of chars)
    this.cache = [];
  }

  async getRnmData(url) {
    const response = await fetch(url);
    const rnmJson = await response.json();
    return rnmJson;
  }

  clearContent() {
    this.list.replaceChildren();
  }

  async addContentToPage(url) {
    let newData = await this.getRnmData(url);
    newData.results.map((char) => {
      this.cache.push(char);
      this.addCharInfo(char, this.list);
    });
  }

  //Change this function to get an array of chars io the array.

  addElement(type, text, elClass) {
    const newElement = document.createElement(type);
    newElement.setAttribute("class", elClass);
    newElement.innerText = text;
    return newElement;
  }

  switchPageLeft(el) {
    let newUrl = this.url;
    if (currentPage === 1) {
      newUrl = this.url;
      if (newUrl.split("/").length === 6) {
        newUrl = this.url.split("/").slice(0, -1).join("/");
      }
    } else if (currentPage > 1) {
      newUrl = this.url.split("/").slice(0, -1).join("/");
      newUrl = newUrl + `/?page=${currentPage - 1}`;
      currentPage--;
    }
    this.clearContent();
    this.addContentToPage(newUrl);
    this.url = newUrl;
    this.updateCounter();
  }

  switchPageRight(el) {
    let newUrl = this.url;
    if (currentPage === 1) {
      newUrl = this.url + `/?page=${currentPage + 1}`;
      currentPage++;
    } else if (currentPage > 1) {
      newUrl = this.url.split("/").slice(0, -1).join("/");
      newUrl = newUrl + `/?page=${currentPage + 1}`;
      currentPage++;
    }
    this.clearContent();
    this.addContentToPage(newUrl);
    this.url = newUrl;
    this.updateCounter();
    //There is a next and previous name of the page in the object!!!
    //Left and right arrows shouldn't be different functions, just be defined in ifs.
  }

  charSearchForm() {
    const input = this.addElement("input", "", "char-search-input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "charName");
    input.setAttribute("placeholder", "Character name");
    document.body.appendChild(input);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        let searchKey = e.srcElement.value;
        this.searchFuntion(searchKey);
      }
    });
  }

  async searchFuntion(key) {
    let firstUrl = this.url;
    let data = await this.getRnmData(firstUrl);
    let nextUrl = "";
    let matchedChars = [];
    console.log(data.info.pages);
    for (let i = 1; i < data.info.pages; i++) {
      data.results.map((char) => {
        if (char.name.includes(key)) {
          matchedChars.push(char);
        }
      });
      nextUrl = data.info.next;
      data = await this.getRnmData(nextUrl);
    }
    this.clearContent();
    matchedChars.map((searchedChar) => {
      console.log(searchedChar);
      this.addCharInfo(searchedChar, this.list);
    });
    firstUrl = this.url;

    // Second search doesn't work???
    // How to make it so all of chars are being loaded passively
    // Can also filter chars on URL. Read the documentation first next time!
  }

  addCharInfo(char, container) {
    let newElement = document.createElement("div");
    newElement.classList.add("char-card");
    container.appendChild(newElement);
    console.log(char);
    let charHiddenInfo = {
      episodes: char.episode,
    };
    let charCardInfo = {
      imageUrl: char.image,
      name: char.name,
      species: char.species,
    };
    let infoElement;
    const objectValues = Object.entries(charCardInfo);
    objectValues.map(([key, value]) => {
      if (key === "imageUrl") {
        infoElement = document.createElement("img");
        infoElement.setAttribute("src", value);
        infoElement.setAttribute("alt", char.name);
      } else {
        infoElement = document.createElement("div");
        infoElement.innerHTML = value;
      }

      newElement.appendChild(infoElement);
    });

    let joinedCharInfo = {
      ...charHiddenInfo,
      ...charCardInfo,
    };

    newElement.addEventListener("click", () => {
      this.openCharTab(joinedCharInfo);
    });
  }

  openCharTab(charInfo) {
    const objectValues = Object.entries(charInfo);
    let newElement = document.createElement("div");
    newElement.classList.add("char-card-window");
    let infoElement;
    let baseUrl = "https://rickandmortyapi.com/api/episode/";
    let episodes;
    let infoElementContainer;
    let episodeInfo;
    objectValues.map(async ([key, value]) => {
      if (key === "imageUrl") {
        infoElement = document.createElement("img");
        infoElement.setAttribute("src", value);
        infoElement.setAttribute("alt", charInfo.name);
      } else if (key === "episodes") {
        infoElementContainer = document.createElement("ul");
        infoElementContainer.classList.add("episodes-container");
        value.map((episode, index) => {
          baseUrl + index + 1 + ",";
        });
        episodes = await this.getRnmData(baseUrl);
        episodes.results.map((episodeObj) => {
          episodeInfo = document.createElement("li");
          episodeInfo.innerHTML = `Episode ID ${episodeObj.id}, Episode Name:${episodeObj.name}`;
          infoElementContainer.appendChild(episodeInfo);
        });
      } else {
        infoElement = document.createElement("div");
        infoElement.innerHTML = value;
      }
      newElement.appendChild(infoElement);
      newElement.appendChild(infoElementContainer);
    });
    const newWindow = window.open("", "_blank");
    //Can I use _blank without url? Can't seem to get it to work
    console.log(newWindow);
    newWindow.document.body.appendChild(newElement);
  }

  updateCounter() {
    const counter = document.querySelector(".counter");
    counter.innerText = currentPage;
  }

  addPagesContainer() {
    const addedContainer = this.addElement("div", "", "pagesContainer");
    document.body.appendChild(addedContainer);

    const arrowLeft = this.addElement("div", "<", "arrowL");
    addedContainer.appendChild(arrowLeft);

    const counter = this.addElement("div", currentPage, "counter");
    addedContainer.appendChild(counter);

    const arrowRight = this.addElement("div", ">", "arrowR");
    addedContainer.appendChild(arrowRight);

    arrowLeft.addEventListener("click", (e) => {
      this.switchPageLeft(e);
    });
    arrowRight.addEventListener("click", (e) => {
      this.switchPageRight(e);
    });
  }
}

let chars = new rnmChars(rnmUrlCharacters);
chars.addContentToPage(chars.url);
chars.addPagesContainer();
chars.charSearchForm();
/*To Do:
1)Make a class for each character in the response
  -class will be created when an individual character is chosen
  -make it so data for each character is cached when page is loaded or searched
  -arrow to take back to main (if global = 1, you are on char, if global = 0, you are in main)
  hmm
*/
