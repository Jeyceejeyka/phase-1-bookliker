document.addEventListener("DOMContentLoaded", () => {
    const listPanel = document.getElementById('list-panel');
    const showPanel = document.getElementById('show-panel');
    const list = document.getElementById('list');
    const apiUrl = "http://localhost:3000/books"; // API URL
  
    // Fetch all books and display them in the list
    function loadBooks() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(books => {
          list.innerHTML = ''; // Clear the list before appending new items
          books.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = book.title;
            listItem.addEventListener('click', () => showBookDetails(book));
            list.appendChild(listItem);
          });
        });
    }
  
    // Show the book details when a title is clicked
    function showBookDetails(book) {
      showPanel.innerHTML = `
        <div class="book-details">
          <img src="${book.img_url}" alt="${book.title}" class="book-thumbnail">
          <h3>${book.title}</h3>
          <h4>${book.author}</h4>
          <p>${book.description}</p>
          <ul class="liked-users">
            ${book.users.map(user => `<li>${user.username}</li>`).join('')}
          </ul>
          <button class="like-button" data-book-id="${book.id}">${isUserLiked(book.users) ? 'Un-Like' : 'Like'} this book</button>
        </div>
      `;
      
      // Add event listener for Like/Un-Like button
      const likeButton = showPanel.querySelector('.like-button');
      likeButton.addEventListener('click', (event) => handleLikeButtonClick(event, book));
    }
  
    // Check if the current user already liked the book
    function isUserLiked(users) {
      const currentUser = { id: 1, username: "pouros" }; // Example user, update based on actual user data
      return users.some(user => user.id === currentUser.id);
    }
  
    // Handle the Like/Un-Like button click
    function handleLikeButtonClick(event, book) {
      event.preventDefault(); // Prevent page reload
  
      const likeButton = event.target;
      const bookId = book.id;
      const currentUser = { id: 1, username: "pouros" }; // Example user, update based on actual user data
  
      // If the user has liked the book, un-like it; otherwise, like it
      const updatedUsers = toggleUserLike(book.users, currentUser);
  
      // Update the book data
      fetch(`${apiUrl}/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: updatedUsers })
      })
      .then(response => response.json())
      .then(updatedBook => {
        showBookDetails(updatedBook); // Re-render the book details
        loadBooks(); // Refresh the book list
      });
    }
  
    // Toggle the user's like status (add/remove user)
    function toggleUserLike(users, currentUser) {
      const userIndex = users.findIndex(user => user.id === currentUser.id);
      if (userIndex !== -1) {
        // User has already liked the book, remove them
        users.splice(userIndex, 1);
      } else {
        // User has not liked the book, add them
        users.push(currentUser);
      }
      return users;
    }
  
    // Initialize the page by loading the books
    loadBooks();
  });
  