document.addEventListener('DOMContentLoaded', function() {

    // ======= LOGIN =======
    document.getElementById('loginForm').addEventListener('submit', function(e){
        e.preventDefault();
        clearLoginErrors();
        let email = document.getElementById('loginEmail').value.trim();
        let password = document.getElementById('loginPassword').value.trim();
        let valid = true;

        if(!email){ document.getElementById('loginEmailError').textContent = 'Email is required'; valid=false; }
        if(!password){ document.getElementById('loginPasswordError').textContent = 'Password is required'; valid=false; }

        if(valid){
            alert(`Logged in with email: ${email}`);
        }
    });

    function clearLoginErrors(){
        document.getElementById('loginEmailError').textContent = '';
        document.getElementById('loginPasswordError').textContent = '';
    }

    // ======= SIGN UP =======
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

        if(!firstName){ document.getElementById('signupFirstNameError').textContent = 'First name is required'; valid=false; }
        if(!lastName){ document.getElementById('signupLastNameError').textContent = 'Last name is required'; valid=false; }
        if(!dob){ document.getElementById('signupDOBError').textContent = 'Date of birth is required'; valid=false; }
        if(!email){ document.getElementById('signupEmailError').textContent = 'Email is required'; valid=false; }
        if(!password){ document.getElementById('signupPasswordError').textContent = 'Password is required'; valid=false; }
        if(password !== confirm){ document.getElementById('signupConfirmError').textContent = 'Passwords do not match'; valid=false; }

        if(valid){
            alert(`Signed up successfully!\nName: ${firstName} ${lastName}\nDOB: ${dob}\nEmail: ${email}`);
            window.location.href = "#Login";
        }
    });

    function clearSignupErrors(){
        document.getElementById('signupFirstNameError').textContent = '';
        document.getElementById('signupLastNameError').textContent = '';
        document.getElementById('signupDOBError').textContent = '';
        document.getElementById('signupEmailError').textContent = '';
        document.getElementById('signupPasswordError').textContent = '';
        document.getElementById('signupConfirmError').textContent = '';
    }

    // ===== From/To autocomplete =====
    const cities = ["Kuala Lumpur", "Penang","Alor Setar", "Johor Bahru", "Melaka", "Ipoh", "Kota Bahru"];

    function setupCityList(inputId, listId) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);

        input.addEventListener("input", () => {
            const value = input.value.toLowerCase();
            list.innerHTML = "";
            if(value) {
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
            if(!list.contains(e.target) && e.target !== input){
                list.innerHTML = "";
            }
        });
    }

    setupCityList("from", "from-list");
    setupCityList("to", "to-list");

    // ===== Booking form =====
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Searching for buses...');
        });
    }

    // ===== Return date toggle =====
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

});