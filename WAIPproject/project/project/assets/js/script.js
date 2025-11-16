

// Basic admin auth check
function checkAdminAuth() {
    if(window.location.pathname.includes('admin.html') && !sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
    }
}

// Global functions for the application
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
// Initialize any global functionality here
    console.log('SmartBus Voyager is ready!');
    
    // Toggle mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Admin page functionality
    if (document.getElementById('addTimeSlot')) {
        // Add time slot functionality
        document.getElementById('addTimeSlot').addEventListener('click', function() {
            const container = document.getElementById('timeSlotsContainer');
            const newSlot = document.createElement('div');
            newSlot.className = 'flex items-center space-x-2';
            newSlot.innerHTML = `
                <input type="time" name="timeSlot" required 
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="button" class="text-red-500 hover:text-red-700 remove-time-slot">
                    <i data-feather="x"></i>
                </button>
            `;
            container.appendChild(newSlot);
            feather.replace();
        });

        // Remove time slot functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-time-slot') || e.target.closest('.remove-time-slot')) {
                const slotToRemove = e.target.closest('div.flex');
                if (slotToRemove) {
                    slotToRemove.remove();
                }
            }
        });

        // Form submission for new schedule
        const scheduleForm = document.getElementById('scheduleForm');
        if (scheduleForm) {
            scheduleForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const routeName = document.getElementById('routeName').value;
                const routeDescription = document.getElementById('routeDescription').value;
                const maxSeats = document.getElementById('maxSeats').value;
                const price = document.getElementById('price').value;
                
                // Get time slots
                const timeSlots = [];
                document.querySelectorAll('input[name="timeSlot"]').forEach(input => {
                    timeSlots.push(input.value);
                });
                
                // In a real app, this would call an API
                const newSchedule = {
                    route: routeName,
                    description: routeDescription,
                    times: timeSlots.join(', '),
                    bookings: 0,
                    maxSeats: parseInt(maxSeats),
                    price: parseFloat(price)
                };
                
                sampleSchedules.push(newSchedule);
                
                // Refresh the table
                const schedulesTable = document.getElementById('schedulesTable');
                schedulesTable.innerHTML = '';
                
                sampleSchedules.forEach((schedule, index) => {
                    const row = document.createElement('tr');
                    row.dataset.id = `schedule-${index}`;
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap">${schedule.route}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${schedule.times}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${schedule.bookings}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button class="edit-btn text-blue-600 hover:text-blue-800 mr-3" data-id="${index}">Edit</button>
                            <button class="delete-btn text-red-600 hover:text-red-800" data-id="${index}">Delete</button>
                        </td>
                    `;
                    schedulesTable.appendChild(row);
                });
                
                alert('Schedule saved successfully!');
                this.reset();
                document.getElementById('timeSlotsContainer').innerHTML = '';
            });
        }
}

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Sample data for admin dashboard
    if (document.getElementById('schedulesTable')) {
        const sampleSchedules = [
            { 
                route: "New York to Boston", 
                times: "08:00, 12:00, 16:00", 
                bookings: 24,
                maxSeats: 40,
                price: 25.00
            },
            { 
                route: "Boston to Washington", 
                times: "09:00, 14:00, 18:00", 
                bookings: 18,
                maxSeats: 40,
                price: 30.00
            },
            { 
                route: "Washington to Philadelphia", 
                times: "07:00, 13:00, 17:00", 
                bookings: 12,
                maxSeats: 40,
                price: 20.00
            }
        ];
const schedulesTable = document.getElementById('schedulesTable');
        sampleSchedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.dataset.id = `schedule-${index}`;
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${schedule.route}</td>
                <td class="px-6 py-4 whitespace-nowrap">${schedule.times}</td>
                <td class="px-6 py-4 whitespace-nowrap">${schedule.bookings}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="edit-btn text-blue-600 hover:text-blue-800 mr-3" data-id="${index}">Edit</button>
                    <button class="delete-btn text-red-600 hover:text-red-800" data-id="${index}">Delete</button>
                </td>
            `;
            schedulesTable.appendChild(row);
});
        // Add event listeners for edit and delete buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
                const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
                const id = btn.dataset.id;
                editSchedule(id);
            }
            
            if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
                const id = btn.dataset.id;
                deleteSchedule(id);
            }
        });

        function editSchedule(id) {
            const schedule = sampleSchedules[id];
            if (!schedule) return;
            
            // Fill the form with existing data
            document.getElementById('routeName').value = schedule.route;
            document.getElementById('routeDescription').value = schedule.description || '';
            document.getElementById('maxSeats').value = schedule.maxSeats || 40;
            document.getElementById('price').value = schedule.price || 20.00;
            
            // Clear existing time slots
            const container = document.getElementById('timeSlotsContainer');
            container.innerHTML = '';
            
            // Add time slots
            schedule.times.split(', ').forEach(time => {
                const newSlot = document.createElement('div');
                newSlot.className = 'flex items-center space-x-2';
                newSlot.innerHTML = `
                    <input type="time" name="timeSlot" value="${time}" required 
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="button" class="text-red-500 hover:text-red-700 remove-time-slot">
                        <i data-feather="x"></i>
                    </button>
                `;
                container.appendChild(newSlot);
            });
            
            feather.replace();
            
            // Scroll to form
            document.getElementById('routeName').scrollIntoView({ behavior: 'smooth' });
        }

        function deleteSchedule(id) {
            if (confirm('Are you sure you want to delete this schedule?')) {
                // In a real app, this would call an API
                sampleSchedules.splice(id, 1);
                
                // Refresh the table
                const schedulesTable = document.getElementById('schedulesTable');
                schedulesTable.innerHTML = '';
                
                sampleSchedules.forEach((schedule, index) => {
                    const row = document.createElement('tr');
                    row.dataset.id = `schedule-${index}`;
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap">${schedule.route}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${schedule.times}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${schedule.bookings}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button class="edit-btn text-blue-600 hover:text-blue-800 mr-3" data-id="${index}">Edit</button>
                            <button class="delete-btn text-red-600 hover:text-red-800" data-id="${index}">Delete</button>
                        </td>
                    `;
                    schedulesTable.appendChild(row);
                });
                
                alert('Schedule deleted successfully!');
            }
        }

        // Sample bookings data
const sampleBookings = [
            { user: "john@example.com", route: "New York to Boston", time: "08:00", seats: 2, date: "2023-08-15" },
            { user: "jane@example.com", route: "Boston to Washington", time: "14:00", seats: 1, date: "2023-08-16" },
            { user: "mike@example.com", route: "Washington to Philadelphia", time: "13:00", seats: 3, date: "2023-08-17" }
        ];

        const bookingsTable = document.getElementById('bookingsTable');
        sampleBookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${booking.user}</td>
                <td class="px-6 py-4 whitespace-nowrap">${booking.route}</td>
                <td class="px-6 py-4 whitespace-nowrap">${booking.time}</td>
                <td class="px-6 py-4 whitespace-nowrap">${booking.seats}</td>
                <td class="px-6 py-4 whitespace-nowrap">${booking.date}</td>
            `;
            bookingsTable.appendChild(row);
        });
    }
});