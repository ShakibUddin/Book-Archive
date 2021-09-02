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
    let response = await fetch(`https://openlibrary.org/search.json?q=${searchText}`);
    let jsonData = await response.json();
    return jsonData;
}

let displayBooks = async jsonData => {
    let books = await jsonData;
    //hiding spinner when data is loaded
    toggleSpinner("none");
    if (books.numFound === 0) {
        toggleAlert("block", "Your search did not match any documents");
    }
    else {
        document.getElementById("total-books").innerText = `Found ${books.numFound} book(s)`;
        books.docs.forEach(book => {
            let bookCard = document.createElement("div");
            let title = !book?.title ? "Unknown" : book?.title;
            let author = !book?.author_name ? "Unknown" : book?.author_name[0];
            let publisher = !book?.publisher ? "Unknown" : book?.publisher[0];
            let publishYear = !book?.first_publish_year ? "Unknown" : book?.first_publish_year;
            let image = "./dummy.jpg";
            if (book?.cover_i) {
                image = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            }
            bookCard.innerHTML = `
            <div class="card shadow-lg p-3 rounded h-100">
            <div class="col-12">
                <img src="${image}" class="card-img-top p-3 w-100" style="height: 500px;object-fit:cover;">
            </div>
            <div class="card-body">
                <p class="card-text fs-4 fw-bold text-primary">${title}</p>
                <p class="card-text"><b>Author:</b> ${author}</p>
                <p class="card-text"><b>Publisher:</b> ${publisher}</p>
                <p class="card-text"><b>First Publish:</b> ${publishYear}</p>
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
        let jsonData = fetchBooks(searchText);
        displayBooks(jsonData);
    }
})