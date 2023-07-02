let currentPage = 1;
const rnmUrlCharacters = "https://rickandmortyapi.com/api/character";
//Change the visible page depending on the global page variable -> make a css class with display:hidden

class rnmChars {
  constructor(url) {
    this.url = url;
    //Replace this.list with a variable, and pass it as an argument
    this.list = document.querySelector(".list-of-chars");
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
      let newElement = document.createElement("li");
      newElement.innerHTML = char.name.toString();
      this.list.appendChild(newElement);
    });
  }

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

    //Left and right arrows shouldn't be different functions, just be defined in ifs.
  }

  charSearch() {
    const form = this.createElement(
      "label",
      "Search a character!",
      "char-search"
    );
    const input = this.createElement("input", "", "char-search-input");

    form;
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
/*To Do:
1)Make a class for each character in the response
    -new Char will be created for each entry in the "results"
    -adding content method
    -highlight method
    -change to characters page method

    How to make properties of each char so it makes sense?


2)Make pagination mechanism so only 6 chars can be displayed on the screen,
if there is more, a new page will be created.
    -each page has its own id -> switching mechanism with seperate css class
    -page with characters(main) will have a shared global variable with page containing more
        details for the character
    -arrow to take back to main (if global = 1, you are on char, if global = 0, you are in main)
hmm
*/
