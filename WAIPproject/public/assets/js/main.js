document.addEventListener('DOMContentLoaded', function() {

    const user_id = 1; // TEMP: replace with logged-in user's ID logic later

    // ================= LOGIN =================
    document.getElementById('loginForm').addEventListener('submit', function(e){
        e.preventDefault();
        clearLoginErrors();

        let email = document.getElementById('loginEmail').value.trim();
        let password = document.getElementById('loginPassword').value.trim();
        let valid = true;

        if (!email) {
            document.getElementById('loginEmailError').textContent = 'Email is required';
            valid = false;
        }
        if (!password) {
            document.getElementById('loginPasswordError').textContent = 'Password is required';
            valid = false;
        }

        if (valid) {
            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, password: password})
            })
            .then(response => response.text())
            .then(result => {
                if (result === 'Login success') {
                    alert('Login successful!');
                    renderTickets(); // render tickets after login
                } else {
                    alert('Login failed: ' + result);
                }
            })
            .catch(error => {
                alert('Connection error: ' + error);
            });
        }
    });

    function clearLoginErrors() {
        document.getElementById('loginEmailError').textContent = '';
        document.getElementById('loginPasswordError').textContent = '';
    }

    // ================= SIGN UP =================
    document.getElementById('signupForm').addEventListener('submit', function(e){
        e.preventDefault();
        clearSignupErrors();

        let firstName = document.getElementById('signupFirstName').value.trim();
        let lastName = document.getElementById('signupLastName').value.trim();
        let dob = document.getElementById('signupDOB').value.trim();
        let email = document.getElementById('signupEmail').value.trim();
        let password = document.getElementById('signupPassword').value.trim();
        let confirm = document.getElementById('signupConfirm').value.trim();

        let valid = true;

        if (!firstName) { document.getElementById('signupFirstNameError').textContent = 'First name is required'; valid = false; }
        if (!lastName) { document.getElementById('signupLastNameError').textContent = 'Last name is required'; valid = false; }
        if (!dob) { document.getElementById('signupDOBError').textContent = 'Date of birth is required'; valid = false; }
        if (!email) { document.getElementById('signupEmailError').textContent = 'Email is required'; valid = false; }
        if (!password) { document.getElementById('signupPasswordError').textContent = 'Password is required'; valid = false; }
        if (password !== confirm) { document.getElementById('signupConfirmError').textContent = 'Passwords do not match'; valid = false; }

        if (valid) {
            fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                    phone_no: '',
                    DOB: dob
                })
            })
            .then(response => response.text())
            .then(result => {
                if (result === 'Register success') {
                    alert('Registration successful!');
                    document.getElementById('signupForm').reset();
                } else {
                    alert('Registration failed: ' + result);
                }
            })
            .catch(error => {
                alert('Connection error: ' + error);
            });
        }
    });

    function clearSignupErrors() {
        document.getElementById('signupFirstNameError').textContent = '';
        document.getElementById('signupLastNameError').textContent = '';
        document.getElementById('signupDOBError').textContent = '';
        document.getElementById('signupEmailError').textContent = '';
        document.getElementById('signupPasswordError').textContent = '';
        document.getElementById('signupConfirmError').textContent = '';
    }

    // ================= AUTOCOMPLETE =================
    const cities = ["Kuala Lumpur", "Penang", "Alor Setar", "Johor Bahru", "Melaka", "Ipoh", "Kota Bahru"];

    function setupCityList(inputId, listId) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);

        input.addEventListener("input", () => {
            const value = input.value.toLowerCase();
            list.innerHTML = "";
            if (value) {
                cities
                    .filter(city => city.toLowerCase().includes(value))
                    .forEach(city => {
                        const li = document.createElement("li");
                        li.textContent = city;
                        li.classList.add("list-group-item", "list-group-item-action");
                        li.addEventListener("click", () => {
                            input.value = city;
                            list.innerHTML = "";
                        });
                        list.appendChild(li);
                    });
            }
        });

        document.addEventListener("click", e => {
            if (!list.contains(e.target) && e.target !== input) {
                list.innerHTML = "";
            }
        });
    }

    setupCityList("from", "from-list");
    setupCityList("to", "to-list");

    // ================= BOOKING FORM =================
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const from = document.getElementById('from').value.trim();
            const to = document.getElementById('to').value.trim();
            const date = document.getElementById('departure-date').value;

            if (!from || !to || !date) {
                alert('Please fill all required fields');
                return;
            }

            fetch('http://localhost:5000/getroutes')
                .then(res => res.json())
                .then(routes => {
                    const matchingRoutes = routes.filter(r => 
                        r.origin.toLowerCase() === from.toLowerCase() &&
                        r.destination.toLowerCase() === to.toLowerCase()
                    );

                    if (matchingRoutes.length === 0) {
                        alert('No routes found for your search');
                        return;
                    }

                    fetch('http://localhost:5000/schedules')
                        .then(res => res.json())
                        .then(schedules => {
                            const matchingSchedules = schedules.filter(s => 
                                matchingRoutes.some(r => r.route_id === s.route_id)
                            );

                            const resultsContainer = document.querySelector('#booking-results');
                            if (resultsContainer) resultsContainer.remove();

                            const container = document.createElement('div');
                            container.id = 'booking-results';
                            container.classList.add('mt-3');

                            if (matchingSchedules.length === 0) {
                                container.innerHTML = '<p>No schedules available for this route.</p>';
                            } else {
                                let html = '<h4>Available Buses:</h4><ul class="list-group">';
                                matchingSchedules.forEach(s => {
                                    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Schedule ID:</strong> ${s.schedule_id}<br>
                                            <strong>Departure:</strong> ${s.departure_time}<br>
                                            <strong>Arrival:</strong> ${s.arrival_time}<br>
                                            <strong>Seats:</strong> ${s.available_seats}
                                        </div>
                                        <button class="btn btn-success book-btn" data-id="${s.schedule_id}">
                                            Book
                                        </button>
                                    </li>`;
                                });
                                html += '</ul>';
                                container.innerHTML = html;
                            }

                            bookingForm.appendChild(container);

                            // Attach book buttons
                            document.querySelectorAll('.book-btn').forEach(btn => {
                                btn.addEventListener('click', function() {
                                    const schedule_id = parseInt(this.getAttribute('data-id'));
                                    fetch('http://localhost:5000/book', {
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            user_id: user_id,
                                            schedule_id: schedule_id,
                                            seat_num: 1,
                                            ticket_price: 35
                                        })
                                    })
                                    .then(res => res.text())
                                    .then(result => {
                                        if (result === 'Booking successful') {
                                            alert('Ticket booked!');
                                            renderTickets();
                                        } else {
                                            alert('Booking failed: ' + result);
                                        }
                                    })
                                    .catch(err => alert('Booking error: ' + err));
                                });
                            });
                        });
                });
        });
    }

    // ================= RENDER BOOKED TICKETS =================
    function renderTickets() {
        const ticketListContainer = document.getElementById('ticket-list');
        if (!ticketListContainer) return;

        fetch(`http://localhost:5000/bookings/${user_id}`)
            .then(res => res.json())
            .then(bookings => {
                if (bookings.length === 0) {
                    ticketListContainer.innerHTML = '<p>No tickets booked yet.</p>';
                    return;
                }

                ticketListContainer.innerHTML = '';
                bookings.forEach(b => {
                    const card = document.createElement('div');
                    card.className = 'card p-3 my-2';
                    card.innerHTML = `
                        <h5>Booked Ticket</h5>
                        <p><strong>Booking ID:</strong> ${b.booking_id}</p>
                        <p><strong>Schedule ID:</strong> ${b.schedule_id}</p>
                        <p><strong>Seat Number:</strong> ${b.seat_num}</p>
                        <p><strong>Status:</strong> ${b.status}</p>
                    `;
                    ticketListContainer.appendChild(card);
                });
            })
            .catch(err => console.error('Error loading bookings:', err));
    }

    // ================= RETURN DATE TOGGLE =================
    const returnDateCheckbox = document.querySelector('#return-date-checkbox');
    const returnDateField = document.querySelector('#return-date-field');

    if (returnDateCheckbox && returnDateField) {
        returnDateCheckbox.addEventListener('change', function() {
            if (this.checked) {
                returnDateField.classList.remove('hidden');
            } else {
                returnDateField.classList.add('hidden');
            }
        });
    }

    // Render tickets on page load
    renderTickets();
});
