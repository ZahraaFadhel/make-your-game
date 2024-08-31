export function toggleCreatePostForm() {
  const form = document.getElementById('create-post-form');
  if (form.style.display === 'none' || form.style.display === '') {
      form.style.display = 'block';
  } else {
      form.style.display = 'none';
  }
}

let createPostBtn = document.querySelector('.create-post-btn');
if(createPostBtn){
  createPostBtn.addEventListener("click", function() {
    const postForm = document.getElementById("create-post-form");
    if (postForm.style.display === "none") {
        postForm.style.display = "block";
    } else {
        postForm.style.display = "none";
    }
  });
}
