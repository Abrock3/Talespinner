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
  if (
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      email
    )
  ) {
    if (
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password) &&
      /\W/.test(password)
    ) {
      if (password.length >= 10) {
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
              if (error.message) {
                alert(error.message);
              } else {
                alert('Sign up failed!');
              }
            }
          } else {
            window.alert('You must fill out all fields!');
          }
        } else {
          window.alert("Your passwords don't match!");
        }
      } else {
        window.alert('Your password must be at least 10 characters long!');
      }
    } else {
      window.alert(
        'Your password must contain at least one letter, number, and symbol.'
      );
    }
  } else {
    window.alert('You must enter a valid email.');
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
