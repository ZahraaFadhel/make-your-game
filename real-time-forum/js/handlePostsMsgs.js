let socket, posts;

async function loadContent(page) {

  const response = await fetch(`/templates/${page}`);
  const data = await response.text();
  document.getElementById('main-content').innerHTML = data;

  // fetch(`/templates/${page}`)
  //   .then(response => response.text())
  //   .then(data => {
  //     document.getElementById('main-content').innerHTML = data;
  //     console.log("in load content");
  //   })
  //   .catch(error => console.error('Error loading content:', error));
}

async function showPage(page) {
  document.getElementById('sign-container').classList.add('hidden');
  document.getElementById('main-content-page').classList.add('hidden');
  
  if (page === 'signin') {
    document.getElementById('sign-container').classList.remove('hidden');
  } else if (page === 'main') {
    document.getElementById('main-content-page').classList.remove('hidden');
    await loadContent('home.html');
    updateWelcomeMessage(localStorage.getItem('nickname'));
    fetchPosts();
  }
}

document.addEventListener("click", function(event) {
  if (event.target && event.target.id === "submit-post-btn") {
    event.preventDefault(); // Prevent default form submission
    const postContent = document.getElementById("post-content").value;
    const categories = Array.from(this.querySelectorAll("input[name='category']:checked"))
    .map(checkbox => checkbox.value);
    
    var sentPost = {
      post_text: postContent,
      post_date: new Date().toISOString(),
      LikeCount: 0,
      dislike_count: 0,
      categories: categories,
    };

    const sentData = {
      type: 'post',
      post: sentPost,
    };
    if (typeof socket !== 'undefined') {
      socket.send(JSON.stringify(sentData));
    }
    document.getElementById("post-content").value = '';
    const form = document.getElementById('create-post-form');
    form.style.display = 'none';
  }
});

function InitializeSocket(){
socket = new WebSocket("ws://localhost:8080/ws");

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.Msg.type === 'post') {
    const postElement = document.createElement("div");
    postElement.classList.add("post-structure");
    postElement.innerHTML = `
          <a href="">
              <div class="top-post">
                  <div class="profile-img-container">
                      <img src="/static/img/pfp.png" class="profile-pic">
                  </div>
                  <div class="profile-info-home">
                      <h5>${data.Username}</h5>
                      <p>posted on ${data.Msg.post.post_date}</p>
                  </div>
              </div>                                              
              <div class = post-categories>
                  ${data.Msg.post.categories.join(', ')}
              </div>
  
              <div class="post-text">
                  <pre>${data.Msg.post.post_text}</pre>
              </div>
          </a>
  
          <div class="post-options">
              <form method="POST" class="like-form">
                  <button type="submit" class="like-button" data-post-id="${data.Msg.post.post_id}" data-is-liked=".IsLiked">
                      <div id="like-heart-.PostID" class="heartLike"></div>
                  </button>
              </form>
              <b>
                  Likes <span id="like-count-.PostID">${data.Msg.post.like_count}</span>
              </b>
              <form method="POST" class="dislike-form">
                  <button type="submit" class="dislike-button" data-post-id="${data.Msg.post.dislike_count}" data-is-disliked=".IsDisliked">
                      <div id="dislike-heart-.PostID" class="heartDislike"></div>
                  </button>
              </form>
              <b>
                  Dislikes <span id="dislike-count-.PostID">${data.Msg.post.like_count}</span>
              </b>
          </div>
    `;
    const postsContainer = document.querySelector("#main-content #posts");
    if (postsContainer) {
      postsContainer.prepend(postElement);
    }
  } 
};
}

document.getElementById("homeTab").addEventListener("click", async function() {
  await loadContent('home.html');
  InitializeSocket();
  updateWelcomeMessage(localStorage.getItem('nickname'));
  fetchPosts();
  displayPosts(posts);
});

document.getElementById("categoriesTab").addEventListener("click", async function() {
  await loadContent('categories.html');
});

document.getElementById("postTab").addEventListener("click",async function() {
  await loadContent('viewPost.html');
});

document.getElementById("chatTab").addEventListener("click",async function() {
  await loadContent('chat.html');
});

document.getElementById("profileTab").addEventListener("click",async function() {
  await loadContent('profile.html');
});

function updateWelcomeMessage(nickname) {
  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.textContent = `Hello, ${nickname}!`;
  }
}

function fetchPosts(){
  fetch('/posts', {
    method: 'GET',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    posts = data;
    displayPosts(posts);
  }).catch(error => {
    console.error('Error:', error);
  });
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = ''; // Clear any existing content

  posts.forEach(post => {
    // Create the post element
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-structure');

    // Populate the post element with content
    postDiv.innerHTML = `
      <a href="">
              <div class="top-post">
                  <div class="profile-img-container">
                      <img src="/static/img/pfp.png" class="profile-pic">
                  </div>
                  <div class="profile-info-home">
                      <h5>${post.username}</h5>
                      <p>posted on ${post.post_date}</p>
                  </div>
              </div>                                              
              <div class = post-categories>
                  ${post.categories.join(', ')}
              </div>
  
              <div class="post-text">
                  <pre>${post.post_text}</pre>
              </div>
          </a>
  
          <div class="post-options">
              <form method="POST" class="like-form">
                  <button type="submit" class="like-button" data-post-id="${post.post_id}" data-is-liked=".IsLiked">
                      <div id="like-heart-.PostID" class="heartLike"></div>
                  </button>
              </form>
              <b>
                  Likes <span id="like-count-.PostID">${post.like_count}</span>
              </b>
              <form method="POST" class="dislike-form">
                  <button type="submit" class="dislike-button" data-post-id="${post.dislike_count}" data-is-disliked=".IsDisliked">
                      <div id="dislike-heart-.PostID" class="heartDislike"></div>
                  </button>
              </form>
              <b>
                  Dislikes <span id="dislike-count-.PostID">${post.like_count}</span>
              </b>
          </div>
    `;

    // Append the post element to the posts container
    postsContainer.appendChild(postDiv);
  });
}

