// Login Form
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();

          const username = document.getElementById('loginUsername').value.trim();
          const password = document.getElementById('loginPassword').value.trim();

          if (username === '' || password === '') {
              alert('Please fill in all fields');
              return;
          }

          // Create FormData object
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);

          // Send AJAX request
          fetch('/api.php?action=login', {
              method: 'POST',
              body: formData
          })
          .then(response => response.text())
          .then(data => {
              alert(data); // Show server response
              if (data === "Login successful!") {
                  window.location.href = 'account.html'; // Redirect on success
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
      });
  }
});

// Toggle register form
document.addEventListener('DOMContentLoaded', function() {
    // Toggle login and registration forms
    const showRegisterFormLink = document.getElementById('showRegisterForm');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');

    if (showRegisterFormLink) {
        showRegisterFormLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
        });
    }
});


// Registration JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const firstName = document.getElementById('registerFirstName').value.trim();
            const lastName = document.getElementById('registerLastName').value.trim();
            const phoneNumber = document.getElementById('registerPhone').value.trim();

            if (username === '' || email === '' || password === '') {
                alert('Please fill in all required fields');
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('phone_number', phoneNumber);

            // Send AJAX request
            fetch('/api.php?action=register', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Registration file not found. Please contact the administrator.');
                    }
                    throw new Error('HTTP error ' + response.status);
                }
                return response.text();
            })
            .then(data => {
                if (data.trim() === "Registration successful!") {
                    alert('Registration successful! You will now be redirected to the login page.');
                    window.location.href = 'login.html';
                } else {
                    alert('Registration failed: ' + data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during registration: ' + error.message);
            });
        });
    }
});

// Cart Page
// Adding to cart
 function addToCart(serviceId, serviceName, price) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
             cart.push({
             id: serviceId,
             name: serviceName,
             price: price
        });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Service added to cart!');
}

// Cart functionality
document.addEventListener('DOMContentLoaded', (event) => {
    loadCart();
});

function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    cart.forEach((item, index) => {
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('col-md-4', 'mb-4');
        itemDiv.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-text">Price: R${item.price}</p>
                    <button onclick="removeFromCart(${index})" class="btn btn-danger">Remove</button>
                </div>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

//checkout
function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    fetch('/api.php?action=checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.removeItem('cart');
            alert('Checkout successful!');
            window.location.href = 'confirmation.html';
        } else {
            alert('Checkout failed. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
}


// Account JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Fetch account details
  fetch('/api.php?action=account')
      .then(response => response.json())
      .then(data => {
          document.getElementById('accountUsername').textContent = data.username;
          document.getElementById('accountEmail').textContent = data.email;
          
          // Populate previous sessions
          const sessionsList = document.getElementById('previousSessions');
          data.sessions.forEach(session => {
              const li = document.createElement('li');
              li.className = 'list-group-item';
              li.textContent = `${session.service_name} on ${session.booking_date}`;
              sessionsList.appendChild(li);
          });
      })
      .catch(error => console.error('Error:', error));

  // Change password functionality
  document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (newPassword !== confirmPassword) {
          alert('New passwords do not match');
          return;
      }

      fetch('/api.php?action=changePassword', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `currentPassword=${currentPassword}&newPassword=${newPassword}`
      })
      .then(response => response.text())
      .then(data => {
          alert(data);
          if (data === 'Password updated successfully') {
              document.getElementById('changePasswordForm').reset();
              document.getElementById('changePasswordFormContainer').style.display = 'none';
          }
      })
      .catch(error => console.error('Error:', error));
  });
});

// Contact Us Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    fetch('/api.php?action=sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  });
}

// Admin page
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadUsers();
    loadServices();
    loadBookings();

    // Add event listeners for add buttons
    document.getElementById('addUserBtn').addEventListener('click', () => showUserModal());
    document.getElementById('addServiceBtn').addEventListener('click', () => showServiceModal());

    // Add event listeners for form submissions
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('serviceForm').addEventListener('submit', handleServiceSubmit);
});

function loadUsers() {
    fetch('/api.php?action=adminApi&subaction=getUsers')
        .then(response => response.json())
        .then(users => {
            const tbody = document.querySelector('#users-table tbody');
            tbody.innerHTML = '';
            users.forEach(user => {
                tbody.innerHTML += `
                    <tr>
                        <td>${user.user_id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="showUserModal(${user.user_id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function loadServices() {
    fetch('/api.php?action=adminApi&subaction=getServices')
        .then(response => response.json())
        .then(services => {
            const tbody = document.querySelector('#services-table tbody');
            tbody.innerHTML = '';
            services.forEach(service => {
                tbody.innerHTML += `
                    <tr>
                        <td>${service.service_id}</td>
                        <td>${service.name}</td>
                        <td>${service.description}</td>
                        <td>${service.price}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="showServiceModal(${service.service_id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteService(${service.service_id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function loadBookings() {
    fetch('/api.php?action=adminApi&subaction=getBookings')
        .then(response => response.json())
        .then(bookings => {
            const tbody = document.querySelector('#bookings-table tbody');
            tbody.innerHTML = '';
            bookings.forEach(booking => {
                tbody.innerHTML += `
                    <tr>
                        <td>${booking.booking_id}</td>
                        <td>${booking.user_id}</td>
                        <td>${booking.service_id}</td>
                        <td>${booking.booking_date}</td>
                        <td>${booking.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="updateBookingStatus(${booking.booking_id})">Update Status</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function showUserModal(userId = null) {
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    if (userId) {
        // Fetch user data and populate form for editing
        fetch(`/api.php?action=adminApi&subaction=getUser&id=${userId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('userId').value = user.user_id;
                document.getElementById('username').value = user.username;
                document.getElementById('email').value = user.email;
                document.getElementById('userModalLabel').textContent = 'Edit User';
            });
    } else {
        // Clear form for adding new user
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('userModalLabel').textContent = 'Add User';
    }
    modal.show();
}

function showServiceModal(serviceId = null) {
    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    if (serviceId) {
        // Fetch service data and populate form for editing
        fetch(`/api.php?action=adminApi&subaction=getService&id=${serviceId}`)
            .then(response => response.json())
            .then(service => {
                document.getElementById('serviceId').value = service.service_id;
                document.getElementById('serviceName').value = service.name;
                document.getElementById('serviceDescription').value = service.description;
                document.getElementById('servicePrice').value = service.price;
                document.getElementById('serviceModalLabel').textContent = 'Edit Service';
            });
    } else {
        // Clear form for adding new service
        document.getElementById('serviceForm').reset();
        document.getElementById('serviceId').value = '';
        document.getElementById('serviceModalLabel').textContent = 'Add Service';
    }
    modal.show();
}

function handleUserSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userId = formData.get('userId');
    const subaction = userId ? 'updateUser' : 'addUser';

    fetch('/api.php?action=adminApi&subaction=' + subaction, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            loadUsers();
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        } else {
            alert('Error: ' + result.message);
        }
    });
}

function handleServiceSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const serviceId = formData.get('serviceId');
    const subaction = serviceId ? 'updateService' : 'addService';

    fetch('/api.php?action=adminApi&subaction=' + subaction, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            loadServices();
            bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
        } else {
            alert('Error: ' + result.message);
        }
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api.php?action=adminApi&subaction=deleteUser&id=${userId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadUsers();
                } else {
                    alert('Error: ' + result.message);
                }
            });
    }
}

function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        fetch(`/api.php?action=adminApi&subaction=deleteService&id=${serviceId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadServices();
                } else {
                    alert('Error: ' + result.message);
                }
            });
    }
}

function updateBookingStatus(bookingId) {
    const newStatus = prompt('Enter new status (pending, confirmed, completed):');
    if (newStatus) {
        fetch('/api.php?action=adminApi&subaction=updateBookingStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${bookingId}&status=${newStatus}`
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                loadBookings();
            } else {
                alert('Error: ' + result.message);
            }
        });
    }
}