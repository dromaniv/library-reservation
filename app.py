from flask import Flask, request, jsonify, render_template
from cassandra_client import CassandraClient
import uuid
from datetime import datetime

app = Flask(__name__)

client = CassandraClient()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/reserve', methods=['POST'])
def reserve():
    user_id = uuid.UUID(request.json['user_id'])
    book_id = uuid.UUID(request.json['book_id'])
    reservation_id = client.make_reservation(user_id, book_id)
    if reservation_id:
        return jsonify({'reservation_id': str(reservation_id)})
    else:
        return jsonify({'error': 'Book does not exist or is already reserved'}), 400

@app.route('/reservation/<reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    reservation = client.get_reservation(uuid.UUID(reservation_id))
    if reservation:
        return jsonify({
            'id': str(reservation.id),
            'user_id': str(reservation.user_id),
            'book_id': str(reservation.book_id),
            'reservation_date': reservation.reservation_date.isoformat(),
            'status': reservation.status
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
    } for book in books])

@app.route('/reservations', methods=['GET'])
def get_reservations():
    reservations = client.get_all_reservations()
    return jsonify([{
        'id': str(reservation.id),
        'user_id': str(reservation.user_id),
        'book_id': str(reservation.book_id),
        'reservation_date': str(reservation.reservation_date),
        'status': reservation.status
    } for reservation in reservations])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
