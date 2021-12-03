document.addEventListener("DOMContentLoaded", function() {
  getList()
});

const list = document.querySelector("ul#list")
const panel = document.querySelector("div#show-panel")

function getList() {
  fetch("http://localhost:3000/books/")
  .then(res => res.json())
  .then(bookData => {
    bookData.forEach(book => {
      renderList(book)
    })
  })
}

function handleClick(e) {
  while (panel.firstChild) {
    panel.removeChild(panel.firstChild)
  }

  fetch(`http://localhost:3000/books/${e.target.id}`)
  .then(res => res.json())
  .then(bookData => {
    renderPanel(bookData)
  })
}

function renderList(book) {
  const li = document.createElement("li")
  li.innerText = book.title
  li.id = book.id
  list.appendChild(li)

  li.addEventListener("click", handleClick)
}

function renderPanel(book) {
  const img = document.createElement("img")
  img.setAttribute("src", book.img_url)
  panel.appendChild(img)

  const h1 = document.createElement("h1")
  h1.innerText = book.title
  panel.appendChild(h1)

  const h2 = document.createElement("h2")
  h2.innerText = book.subtitle
  panel.appendChild(h2)

  const h3 = document.createElement("h3")
  h3.innerText = book.author
  panel.appendChild(h3)

  const p = document.createElement("p")
  p.innerText = book.description
  panel.appendChild(p)
  
  const ul = document.createElement("ul")
  book.users.forEach(user => {
    const el = document.createElement("li")
    ul.appendChild(el)
    el.innerText = user.username
  })
  panel.appendChild(ul)

  const btn = document.createElement("button")
  btn.innerText = "LIKE"
  panel.appendChild(btn)

  btn.addEventListener("click", () => {
    updateUsers(book)
  })
}

function updateUsers(book) {
  const newUser = {"id": 1, "username": "pouros"}
  let userData = book.users
  
  if (userData.filter(data => data.id === 1).length > 0) {
    userData.pop(newUser)
  }
  else {
    userData.push(newUser)
  }

  fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "users": userData
      })
    })
    .then(res => res.json())
    .then(data => {
      while (panel.firstChild) {
        panel.removeChild(panel.firstChild)
      }

      renderPanel(data)
    })
}
