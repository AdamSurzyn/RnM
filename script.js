let currentPage = 1;
const rnmUrlCharacters = "https://rickandmortyapi.com/api/character";
//Change the visible page depending on the global page variable -> make a css class with display:hidden

class rnmChars {
  constructor(url) {
    this.url = url;
    //Replace this.list with a variable, and pass it as an argument
    this.list = document.querySelector(".list-of-chars");
  }

  async getRnmData() {
    const response = await fetch(this.url);
    const rnmJson = await response.json();
    return rnmJson;
  }

  clearContent() {
    this.list.replaceChildren();
  }

  async addContentToPage() {
    let newData = await this.getRnmData();
    newData.results.map((char) => {
      let newElement = document.createElement("li");
      newElement.innerHTML = char.name.toString();
      this.list.appendChild(newElement);
    });
  }

  switchPage(el) {
    let fromPage = el.srcElement.innerText;
    console.log(el.srcElement.innerText);
    if (currentPage === 1) {
      this.url = this.url + `?page=${currentPage}`;
    } else if (currentPage > 1) {
      this.url = this.url.replace(`?page=${currentPage}`, `?page=${fromPage}`);
      currentPage = fromPage;
    }
    this.clearContent();
    this.addContentToPage();
    this.addPageElement();
    currentPage++;
  }

  charSearch() {}

  addPageElement() {
    if (currentPage === 1) {
      const addedContainer = document.createElement("div");
      document.body.appendChild(addedContainer);
      addedContainer.setAttribute("class", "pagesContainer");
      const addedPage = document.createElement("div");
      addedContainer.appendChild(addedPage);
      addedPage.setAttribute("id", `page ${currentPage}`);
      addedPage.innerHTML = currentPage.toString();
      addedPage.addEventListener("click", (e) => {
        this.switchPage(e);
      });
      addedContainer.appendChild(addedPage);
    } else if (currentPage > 1) {
      console.log("added");
      const addedContainer = document.querySelector(".pagesConatainer");
      const addedPage = addedContainer.createElement("div");
      addedContainer.appendChild(addedPage);
      addedPage.setAttribute("id", `page ${currentPage}`);
      addedPage.innerHTML = currentPage.toString();
      addedContainer.appendChild(addedPage);
      addedPage.addEventListener("click", (e) => {
        this.switchPage(e);
      });
    }
  }

  addPagesContainer() {
    const addedContainer = document.createElement("div");
    document.body.appendChild(addedContainer);
    addedContainer.setAttribute("class", "pagesContainer");
    const arrowLeft = document.createElement("div");
    arrowLeft.setAttribute("class", "arrowL");
    arrowLeft.innerText = "<";
    addedContainer.appendChild(arrowLeft);
    const arrowRight = document.createElement("div");
    arrowRight.setAttribute("class", "arrowR");
    arrowRight.innerText = ">";
    addedContainer.appendChild(arrowRight);
    const counter = document.createElement("div");
    counter.setAttribute("class", "counter");
    counter.innerHTML = currentPage;
    addedContainer.appendChild(counter);

    addedPage.addEventListener("click", (e) => {
      this.switchPage(e);
    });
  }
}

let chars = new rnmChars(rnmUrlCharacters);
chars.addContentToPage();
chars.addPageElement();
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
