import {toggleCreatePostForm} from './home.js';

document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener('click', function(event) {
      if (event.target.closest('.create-post-btn')) {
        toggleCreatePostForm();
      }
  });
  
});


// Handle scrolling CSS
window.onscroll = function() {
  var navbar = document.getElementById("navbar");
  if (window.scrollY > 200) {
      navbar.classList.add("scrolled");
  } else {
      navbar.classList.remove("scrolled");
  }
};

// HANDLE SIGN IN FORM
document.getElementById('signInForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);

  // Send the form data using fetch
  fetch('/login', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    // Handle success response
    localStorage.setItem('nickname', data.nickname);
    InitializeSocket();
    showPage('main');

  }).catch(error => {
    console.error('Error:', error);
  });

});

// HANDLE SIGN UP FORM
document.getElementById('signUpForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);

  // Send the form data using fetch
  fetch('/register', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    // Handle success response
    console.log('Success:', data);
    localStorage.setItem('nickname', data.nickname);
    InitializeSocket();
    showPage('main');
  }).catch(error => {
    console.error('Error:', error);
  });
});

// Event listener for switching to the sign-up view
document.getElementById('to-sign-up-btn').addEventListener('click', function() {
  document.querySelector('.container').classList.add('right-panel-active');
});

// Event listener for switching to the sign-in view
document.getElementById('to-sign-in-btn').addEventListener('click', function() {
  document.querySelector('.container').classList.remove('right-panel-active');
});

// Sign up / log in
const signUpButton = document.getElementById('to-sign-up-btn');
const signInButton = document.getElementById('to-sign-in-btn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

