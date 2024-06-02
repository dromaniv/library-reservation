document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();

    document.getElementById('reserve-book-form').addEventListener('submit', function(event) {
        event.preventDefault();
        makeReservation();
    });

    document.getElementById('update-reservation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        updateReservation();
    });

    document.getElementById('cancel-reservation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        cancelReservation();
    });

    document.getElementById('view-reservation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        viewReservation();
    });

    fetchReservations();
});

function fetchBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(books => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} by ${book.author} (ID: ${book.id})`;
                li.classList.add('list-group-item');
                bookList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}

function makeReservation() {
    const userId = document.getElementById('user_id').value;
    const bookId = document.getElementById('book_id').value;

    fetch('/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            book_id: bookId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.error ? 'danger' : 'success', data.error || `Reservation successful! Reservation ID: ${data.reservation_id}`);
    })
    .catch(error => {
        console.error('Error making reservation:', error);
        showMessage('danger', 'An error occurred while making the reservation.');
    });
}

function updateReservation() {
    const reservationId = document.getElementById('reservation_id_update').value;
    const newDate = document.getElementById('new_date').value;

    fetch('/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reservation_id: reservationId,
            new_date: newDate,
        }),
    })
    .then(response => response.json())
    .then(data => {
        showMessage('warning', 'Reservation updated.');
    })
    .catch(error => {
        console.error('Error updating reservation:', error);
        showMessage('danger', 'An error occurred while updating the reservation.');
    });
}

function cancelReservation() {
    const reservationId = document.getElementById('reservation_id_cancel').value;

    fetch(`/cancel/${reservationId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        showMessage('danger', 'Reservation cancelled.');
    })
    .catch(error => {
        console.error('Error cancelling reservation:', error);
        showMessage('danger', 'An error occurred while cancelling the reservation.');
    });
}

function viewReservation() {
    const reservationId = document.getElementById('reservation_id_view').value;

    fetch(`/reservation/${reservationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showMessage('danger', data.error);
            } else {
                const details = `
ID: ${data.id}
User ID: ${data.user_id}
Book ID: ${data.book_id}
Reservation Date: ${data.reservation_date}
Status: ${data.status}
`;
                document.getElementById('reservation-details-content').textContent = details;
                document.getElementById('reservation-details').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error viewing reservation:', error);
            showMessage('danger', 'An error occurred while viewing the reservation.');
        });
}

function fetchReservations() {
    fetch('/reservations')
        .then(response => response.json())
        .then(reservations => {
            const reservationList = document.getElementById('reservation-list');
            reservationList.innerHTML = '';
            reservations.forEach(reservation => {
                const li = document.createElement('li');
                li.textContent = `Reservation ID: ${reservation.id}, User ID: ${reservation.user_id}, Book ID: ${reservation.book_id}, Date: ${reservation.reservation_date}`;
                li.classList.add('list-group-item');
                reservationList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching reservations:', error);
        });
}


function showMessage(type, message) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
    fetchReservations();
}
