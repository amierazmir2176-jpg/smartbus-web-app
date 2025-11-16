document.addEventListener('DOMContentLoaded', () => {

    // Set admin logged in
    sessionStorage.setItem('adminLoggedIn', 'true');

    // Feather icons
    if (window.feather) feather.replace();

    // Booking chart (optional)
    const ctx = document.getElementById('bookingChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
                datasets: [{
                    label: 'Bookings per Time Slot',
                    data: [12, 19, 3, 5],
                    backgroundColor: [
                        'rgba(59,130,246,0.7)',
                        'rgba(99,102,241,0.7)',
                        'rgba(139,92,246,0.7)',
                        'rgba(168,85,247,0.7)'
                    ],
                    borderColor: [
                        'rgba(59,130,246,1)',
                        'rgba(99,102,241,1)',
                        'rgba(139,92,246,1)',
                        'rgba(168,85,247,1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    const form = document.getElementById('scheduleForm');
    const table = document.getElementById('schedulesTable');

    // Load existing schedules from server
    function loadSchedules() {
        fetch('http://localhost:5000/schedules')
            .then(res => res.json())
            .then(data => {
                table.innerHTML = '';
                data.forEach(s => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap">${s.route_name || ''}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${s.route_description || ''}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${s.time_slot || ''}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${s.max_seats || s.available_seats || ''}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${s.price || ''}</td>
                    `;
                    table.appendChild(row);
                });
            });
    }

    loadSchedules(); // initial load

    // Handle form submission
    form.addEventListener('submit', e => {
        e.preventDefault();

        const routeName = document.getElementById('routeName').value.trim();
        const description = document.getElementById('routeDescription').value.trim();
        const timeSlot = document.getElementById('timeSlot').value.trim();
        const maxSeats = parseInt(document.getElementById('maxSeats').value);
        const price = parseFloat(document.getElementById('price').value);

        if (!routeName || !timeSlot) {
            alert("Route Name and Time Slot are required.");
            return;
        }

        // POST new schedule to backend
        fetch('http://localhost:5000/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                route_name: routeName,
                route_description: description,
                time_slot: timeSlot,
                max_seats: maxSeats,
                price: price
            })
        })
        .then(res => res.text())
        .then(result => {
            alert(result);   // e.g., "Schedule added successfully"
            form.reset();
            loadSchedules(); // reload table to show the new schedule
        })
        .catch(err => alert('Error adding schedule: ' + err));
    });
});
