$(function () {

  let currentUserId = 1;
  const maxUserId = 30;


  async function displayUserProfile(userId) {
    try {
      const user = await getUserData(userId);
      const userName = `${user.firstName}`;
      await getUserPosts(userId, userName);
      await getUserTodos(userId, userName);
    } catch (error) {
      console.error('Error displaying user profile:', error);
    }
  }

  //user Info
  async function getUserData(userId) {
    try {
      const response = await $.ajax({
        url: `https://dummyjson.com/users/${userId}`,
        method: 'GET'
      });
      displayUserData(response);
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  function displayUserData(user) {
    $('.info__image img').attr('src', user.image);
    $('.info__content').html(`
      <h2>${user.firstName} ${user.lastName}</h2>
      <p>AGE : ${user.age}</p>
      <p>Email : ${user.email}</p>
      <p>Phone : ${user.phone}</p>
    `);
  }

  // user posts
  async function getUserPosts(userId, userName) {
    try {
      const response = await $.ajax({
        url: `https://dummyjson.com/users/${userId}/posts`,
        method: 'GET'
      });
      displayUserPosts(response, userName);
      return response;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }

  function displayUserPosts(data, userName) {
    const posts = data.posts;
    if (posts.length === 0) {
      $('.posts h3').text(`${userName}'s Posts`);
      $('.posts ul').html('<li>User has no posts.</li>');
      return;
    } else {
      const postsList = $.map(posts, function (post) {
        console.log(post);
        return `
        <li>
        <a href="#" class="post-link" data-post-id="${post.id}">${post.title}</a>
        <br>
        ${post.body}
        </li>
        `;
      }).join('');

      $('.posts h3').text(`${userName}'s Posts`);
      $('.posts ul').html(postsList);
    }
  }

  //user todos
  async function getUserTodos(userId, userName) {

    try {
      const response = await $.ajax({
        url: `https://dummyjson.com/users/${userId}/todos`,
        method: 'GET'
      });
      displayUserTodos(response, userName);
      return response;
    } catch (error) {
      console.error('Error fetching user todos:', error);
      throw error;
    }
  }

  function displayUserTodos(data, userName) {
    const todos = data.todos;
    if (todos.length === 0) {
      $('.todos h3').text(`${userName}'s Todos`);
      $('.todos ul').html('<li>User has no todos.</li>');
      return;
    } else {
      const todosList = $.map(todos, function (todoObj) {
        return `
        <li>${todoObj.todo}</li>
        `;
      }).join('');
      $('.todos h3').text(`${userName}'s Todos`);
      $('.todos ul').html(todosList);
    }
  }



  $('header button').on('click', function () {
    if ($(this).text().includes('Previous')) {
      currentUserId = currentUserId === 1 ? maxUserId : currentUserId - 1;
    } else if ($(this).text().includes('Next')) {
      currentUserId = currentUserId === maxUserId ? 1 : currentUserId + 1;
    }
    displayUserProfile(currentUserId);
  });

  displayUserProfile(currentUserId);

  $(".posts h3").on("click", function () {
    $(".posts ul").slideToggle("slow");
  });

  $(".todos h3").on("click", function () {
    $(".todos ul").slideToggle("slow");
  });

  $('body').append(`
    <div 
    id="modal"
    style="display:none;
    position:fixed;
    top:30%;
    left:50%;
    transform:translate(-50%, -50%);
    background:white;
    padding:20px;
    max-width: 500px;
    border:1px solid #ccc;
    z-index:1000;"
    >
      <div id="modal-content"></div>
      <button id="modal-close">Close</button>
    </div>
  `);

  $('#modal-close').on('click', function () {
    $('#modal').hide();
  });

  $(document).on('click', '.post-link', async function (event) {
    event.preventDefault();
    const postId = $(this).data('post-id');
    try {
      const response = await $.ajax({
        url: `https://dummyjson.com/posts/${postId}`,
        method: 'GET'
      });
      $('#modal-content').html(`
        <h2>${response.title}</h2>
        <p>${response.body}</p>
        <p>view: ${response.views}</p>
      `);
      $('#modal').show();
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  });

});