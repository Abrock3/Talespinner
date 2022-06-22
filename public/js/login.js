const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/lobby');
    } else {
      const error = await response.json();
      alert(error.message);
    }
  }
};

// collects info from the signup form and uses it to POST a new user creation request to the server
const signupFormHandler = async (event) => {
  event.preventDefault();
  const name = document.querySelector('#id-signup').value.trim();
  const email = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const confirm = document
    .querySelector('#password-signup-confirm')
    .value.trim();
  // determines that the passwords match
  if (password.length >= 8) {
    if (confirm === password) {
      if (name && email && password) {
        const response = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          document.location.replace('/lobby');
        } else {
          const error = await response.json();
          alert(error.message);
        }
      } else {
        window.alert('You must fill out all fields!');
      }
    } else {
      window.alert("Your passwords don't match!");
    }
  } else {
    window.alert('Your password must be at least 8 characters long!');
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
