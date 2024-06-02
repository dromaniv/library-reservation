from flask import Flask, request, jsonify, render_template, session
from cassandra_client import CassandraClient
import uuid
from datetime import datetime

app = Flask("library")
app.secret_key = 'super secret key'

client = CassandraClient()

@app.route('/')
def index():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')

@app.route('/reserve', methods=['POST'])
def reserve():
    user_id = uuid.UUID(session['user_id'])
    book_id = uuid.UUID(request.json['book_id'])
    reservation_id, error = client.make_reservation(user_id, book_id)
    if reservation_id:
        return jsonify({'reservation_id': str(reservation_id)})
    else:
        return jsonify({'error': error}), 400

@app.route('/reservation/<reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    reservation = client.get_reservation(uuid.UUID(reservation_id))
    if reservation:
        book = client.get_book(reservation.book_id)
        return jsonify({
            'id': str(reservation.id),
            'user_id': str(reservation.user_id),
            'book_id': str(reservation.book_id),
            'reservation_date': str(reservation.reservation_date),
            'status': reservation.status,
            'book_title': book.title,
            'book_author': book.author,
            'book_published_date': str(book.published_date),
            'book_pages': book.pages
        })
    else:
        return jsonify({'error': 'Reservation not found'}), 404

@app.route('/update', methods=['PUT'])
def update():
    reservation_id = uuid.UUID(request.json['reservation_id'])
    new_date = datetime.fromisoformat(request.json['new_date'])
    client.update_reservation(reservation_id, new_date)
    return jsonify({'status': 'updated'})

@app.route('/cancel/<reservation_id>', methods=['DELETE'])
def cancel(reservation_id):
    client.cancel_reservation(uuid.UUID(reservation_id))
    return jsonify({'status': 'cancelled'})

@app.route('/books', methods=['GET'])
def get_books():
    books = client.get_books()
    return jsonify([{
        'id': str(book.id),
        'title': book.title,
        'author': book.author,
        'published_date': str(book.published_date),
        'pages': book.pages
    } for book in books])

@app.route('/all_reservations', methods=['GET'])
def get_all_reservations():
    reservations = client.get_all_reservations()
    return jsonify([{
        'id': str(reservation.id),
        'user_id': str(reservation.user_id),
        'book_id': str(reservation.book_id),
        'reservation_date': str(reservation.reservation_date),
        'status': reservation.status
    } for reservation in reservations])

@app.route('/reservations', methods=['GET'])
def get_reservations():
    user_id = uuid.UUID(session['user_id'])
    reservations = client.get_reservations_by_user(user_id)
    return jsonify([{
        'id': str(reservation.id),
        'user_id': str(reservation.user_id),
        'book_id': str(reservation.book_id),
        'reservation_date': str(reservation.reservation_date),
        'status': reservation.status
    } for reservation in reservations])

@app.route('/book/<book_id>', methods=['GET'])
def get_book(book_id):
    book = client.get_book(uuid.UUID(book_id))
    if book:
        return jsonify({
            'id': str(book.id),
            'title': book.title,
            'author': book.author,
            'published_date': str(book.published_date),
            'pages': book.pages
        })
    else:
        return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
