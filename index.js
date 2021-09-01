let extractSearchText = () => {
    let searchBox = document.getElementById("search-box");
    let text = searchBox.value;
    searchBox.value = "";
    return text;
}

let toggleAlert = (displayStyle, message) => {
    if (displayStyle === "block") {
        document.getElementById("alert-text").innerText = message;
    }
    document.getElementById("alert-text").style.display = displayStyle;
}

let toggleSpinner = displayStyle => {
    document.getElementById("spinner").style.display = displayStyle;
}

let clearPreviousData = () => {
    document.getElementById("total-books").textContent = "";
    document.getElementById("books-section").textContent = "";
}

let fetchBooks = async searchText => {
    let response = await fetch(`http://openlibrary.org/search.json?q=${searchText}`);
    let jsonData = await response.json();
    return jsonData;
}

let displayBooks = async jsonData => {
    let books = await jsonData;
    console.log(books);
    //hiding spinner when data is loaded
    toggleSpinner("none");
    if (books.numFound === 0) {
        toggleAlert("block", `Your search did not match any documents.`)
    }
    else {
        document.getElementById("total-books").innerText = `About ${books.numFound} results`;
        books.docs.forEach(book => {
            let bookCard = document.createElement("div");
            let image = "./dummy.jfif";
            if (book?.cover_i) {
                image = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            }
            bookCard.innerHTML = `
            <div class="card m-2" style="width: 18rem;">
            <div class="h-75">
                <img src="${image}" class="card-img-top h-100">
            </div>
            <div class="card-body">
                <p class="card-title fs-4 fw-bold">${book?.title}</p>
                <p class="card-text"><b>Author:</b> ${book?.author_name}</p>
                <p class="card-text"><b>Publisher:</b> ${book?.publisher}</p>
                <p class="card-text"><b>First Publish:</b> ${book?.first_publish_year}</p>
            </div>
            </div>
            `;
            document.getElementById("books-section").append(bookCard);
        })
    }
}

//initially hide spinner
toggleSpinner("none");
//initially hide alert text
toggleAlert("none");

document.getElementById("search-button").addEventListener("click", () => {
    let searchText = extractSearchText();
    if (searchText.length === 0) {
        toggleAlert("block", "Search box is empty!");
    }
    else {
        //clearing previous data before new api call
        clearPreviousData();
        //showing spiner before api call
        toggleSpinner("block");
        toggleAlert("none");
        try {
            let jsonData = fetchBooks(searchText);
            displayBooks(jsonData);
        }
        catch (error) {
            toggleAlert("block", "Failed to fetch books!");
        }
    }
})