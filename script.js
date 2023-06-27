const currentPage = 1;
const rnmUrlCharacters = "https://rickandmortyapi.com/api/character";
//Change the visible page depending on the global page variable -> make a css class with display:hidden

const rickApi = async () => {
  const response = await fetch(rnmUrlCharacters);
  const rnmJson = await response.json();
  return rnmJson;
};

rickApi().then((chars) => {
  const list = document.querySelector(".list-of-chars");
  chars.results.forEach((char) => {
    let newElement = document.createElement("li");
    newElement.innerHTML = char.name.toString();
    list.appendChild(newElement);
  });
});

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
