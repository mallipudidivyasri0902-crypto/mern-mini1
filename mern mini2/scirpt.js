const container = document.getElementById("booksContainer");

document
.getElementById("searchBtn")
.addEventListener("click", searchBooks);

async function searchBooks(){

const query =
document.getElementById("searchInput").value;

const res = await fetch(
`https://openlibrary.org/search.json?q=${query}`
);

const data = await res.json();

displayBooks(data.docs.slice(0,10));

}

function displayBooks(books){

container.innerHTML="";

books.forEach(book=>{

const cover =
book.cover_i
? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
: "https://via.placeholder.com/300";

const card = document.createElement("div");

card.className="book-card";

card.innerHTML=`

<img src="${cover}">

<div class="book-info">

<h3>${book.title}</h3>

<p>${book.author_name?.[0] || "Unknown"}</p>

<div class="rating"
data-id="${book.key}">

${createStars(book.key)}

</div>

<button
class="read-btn"
onclick="toggleRead('${book.key}')">

Mark Read

</button>

<button
onclick="saveBook(
'${book.key}',
'${book.title}'
)">

❤️ Wishlist

</button>

</div>
`;

container.appendChild(card);

});

attachStarEvents();

}

function createStars(id){

let stars="";

for(let i=1;i<=5;i++){

stars += `
<i class="fa-solid fa-star star"
data-book="${id}"
data-rating="${i}">
</i>
`;

}

return stars;
}

function attachStarEvents(){

document.querySelectorAll(".star")
.forEach(star=>{

star.addEventListener("click", async()=>{

const rating =
star.dataset.rating;

const bookId =
star.dataset.book;

highlightStars(bookId,rating);

await updateRating(
bookId,
rating
);

});

});

}

function highlightStars(id,rating){

document
.querySelectorAll(
`.star[data-book="${id}"]`
)
.forEach(star=>{

star.classList.toggle(
"active",
star.dataset.rating <= rating
);

});

}

async function saveBook(id,title){

await fetch(
"http://localhost:5000/books",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
bookId:id,
title
})
}
);

alert("Book Saved");

}

async function updateRating(id,rating){

await fetch(
`http://localhost:5000/books/${id}/rating`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
rating
})
}
);

}

async function toggleRead(id){

await fetch(
`http://localhost:5000/books/${id}/read`,
{
method:"PUT"
}
);

alert("Status Updated");

}