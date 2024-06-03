document.addEventListener('DOMContentLoaded', function() {
    refresh();
});

function refresh() {
    showLoading();
    fetchBooks();
    fetchMyReservations();
    fetchReservedBooks();
    document.getElementById('reservation-details').style.display = 'none';
}

function fetchBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(books => fetch('/all_reservations')
            .then(response => response.json())
            .then(reservations => {
                const reservedBookIds = new Set(reservations.map(reservation => reservation.book_id));
                return books.filter(book => !reservedBookIds.has(book.id));
            })
        )
        .then(displayBooks)
        .catch(error => showError('Error fetching books:', error));
}

function displayBooks(availableBooks) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    availableBooks.forEach(book => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
            <span>"${book.title}" by ${book.author} [${book.published_date}]</span>
            <button class="btn btn-primary btn-sm" onclick="reserveBook('${book.id}')">Reserve</button>
        `;
        bookList.appendChild(li);
    });
    hideLoading();
}

function fetchReservedBooks() {
    fetch('/all_reservations')
        .then(response => response.json())
        .then(allReservations => fetch('/reservations')
            .then(response => response.json())
            .then(userReservations => {
                const userReservationBookIds = new Set(userReservations.map(reservation => reservation.book_id));
                const reservedBookList = document.getElementById('reserved-book-list');
                reservedBookList.innerHTML = '';
                allReservations.forEach(reservation => {
                    if (!userReservationBookIds.has(reservation.book_id)) {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        fetch(`/book/${reservation.book_id}`)
                            .then(response => response.json())
                            .then(book => {
                                li.innerHTML = `
                                    <span>${book.author}'s "${book.title}" (Reserved by user: ${reservation.user_id.substring(0, 4)}...)</span>
                                `;
                                reservedBookList.appendChild(li);
                            });
                    }
                });
            })
        )
        .catch(error => showError('Error fetching reserved books:', error));
}

function reserveBook(bookId) {
    fetch('/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: bookId }),
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.error ? 'danger' : 'success', data.error || `Reservation successful! Reservation ID: ${data.reservation_id}`);
        refresh();
    })
    .catch(error => showError('Error making reservation:', error));
}

function fetchMyReservations() {
    fetch('/reservations')
        .then(response => response.json())
        .then(displayMyReservations)
        .catch(error => showError('Error fetching reservations:', error));
}

function displayMyReservations(reservations) {
    const reservationList = document.getElementById('reservation-list');
    reservationList.innerHTML = '';
    reservations.forEach(reservation => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
            <span>Reservation ${reservation.id.substring(0, 4)}... from ${reservation.reservation_date.split('.')[0]}</span>
            <div>
                <button class="btn btn-info btn-sm" onclick="viewReservation('${reservation.id}')">View</button>
                <button class="btn btn-warning btn-sm" onclick="updateReservationPrompt('${reservation.id}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="cancelReservation('${reservation.id}')">Cancel</button>
            </div>
        `;
        reservationList.appendChild(li);
    });
}

function viewReservation(reservationId) {
    fetch(`/reservation/${reservationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showMessage('danger', data.error);
            } else {
                const details = `
Reservation ID: ${data.id}
User ID: ${data.user_id}
Book ID: ${data.book_id}
Reservation Date: ${data.reservation_date}
Book Title: ${data.book_title}
Book Author: ${data.book_author}
Published Date: ${data.book_published_date}
Pages: ${data.book_pages}
`;
                document.getElementById('reservation-details-content').textContent = details;
                document.getElementById('reservation-details').style.display = 'block';
            }
        })
        .catch(error => showError('Error viewing reservation:', error));
}

function updateReservationPrompt(reservationId) {
    const newDate = prompt("Enter new reservation date (YYYY-MM-DD):");
    if (newDate) {
        updateReservation(reservationId, newDate);
    }
}

function updateReservation(reservationId, newDate) {
    fetch('/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservation_id: reservationId, new_date: newDate }),
    })
    .then(response => response.json())
    .then(() => {
        showMessage('warning', 'Reservation updated.');
        refresh();
    })
    .catch(error => showError('Error updating reservation:', error));
}

function cancelReservation(reservationId) {
    fetch(`/cancel/${reservationId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        showMessage('danger', 'Reservation cancelled.');
        refresh();
    })
    .catch(error => showError('Error cancelling reservation:', error));
}

function showMessage(type, message) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    clearTimeout(window.messageTimeout);
    window.messageTimeout = setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function showError(prefix, error) {
    console.error(prefix, error);
    showMessage('danger', `${prefix} ${error.message}`);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading';
    loader.className = 'spinner-border text-primary';
    loader.role = 'status';
    loader.innerHTML = '<span class="sr-only">Loading...</span>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loading');
    if (loader) {
        document.body.removeChild(loader);
    }
}
