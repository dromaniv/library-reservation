document.addEventListener('DOMContentLoaded', function() {
    refresh();
});

function refresh() {
    fetchBooks();
    fetchMyReservations();
    fetchReservedBooks();
    document.getElementById('reservation-details').style.display = 'none';
}

function fetchBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(books => {
            return fetch('/all_reservations')
                .then(response => response.json())
                .then(reservations => {
                    const reservedBookIds = new Set(reservations.map(reservation => reservation.book_id));
                    return books.filter(book => !reservedBookIds.has(book.id));
                });
        })
        .then(availableBooks => {
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
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}

function fetchReservedBooks() {
    fetch('/all_reservations')
        .then(response => response.json())
        .then(allReservations => {
            return fetch('/reservations')
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
                });
        })
        .catch(error => {
            console.error('Error fetching reserved books:', error);
        });
}


function reserveBook(bookId) {
    fetch('/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            book_id: bookId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.error ? 'danger' : 'success', data.error || `Reservation successful! Reservation ID: ${data.reservation_id}`);
        refresh();
    })
    .catch(error => {
        console.error('Error making reservation:', error);
        showMessage('danger', 'An error occurred while making the reservation.');
    });
}

function fetchMyReservations() {
    fetch('/reservations')
        .then(response => response.json())
        .then(reservations => {
            const reservationList = document.getElementById('reservation-list');
            reservationList.innerHTML = '';
            reservations.forEach(reservation => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                li.innerHTML = `
                    <span>Reservation ${reservation.id.substring(0, 4)}... from ${reservation.reservation_date.split('T')[0]}</span>
                    <div>
                        <button class="btn btn-info btn-sm" onclick="viewReservation('${reservation.id}')">View</button>
                        <button class="btn btn-warning btn-sm" onclick="updateReservationPrompt('${reservation.id}')">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelReservation('${reservation.id}')">Cancel</button>
                    </div>
                `;
                reservationList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching reservations:', error);
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
Status: ${data.status}
Book Title: ${data.book_title}
Book Author: ${data.book_author}
Published Date: ${data.book_published_date}
Pages: ${data.book_pages}
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
        body: JSON.stringify({
            reservation_id: reservationId,
            new_date: newDate,
        }),
    })
    .then(response => response.json())
    .then(data => {
        showMessage('warning', 'Reservation updated.');
        refresh();
    })
    .catch(error => {
        console.error('Error updating reservation:', error);
        showMessage('danger', 'An error occurred while updating the reservation.');
    });
}

function cancelReservation(reservationId) {
    fetch(`/cancel/${reservationId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        showMessage('danger', 'Reservation cancelled.');
        refresh();
    })
    .catch(error => {
        console.error('Error cancelling reservation:', error);
        showMessage('danger', 'An error occurred while cancelling the reservation.');
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
}
