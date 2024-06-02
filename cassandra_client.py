from cassandra.cluster import Cluster
from cassandra.query import SimpleStatement
import uuid
from datetime import datetime
import threading

def get_session():
    cluster = Cluster(['127.0.0.1'])  # Adjust to your cluster's contact points if necessary
    session = cluster.connect('library')
    return cluster, session

class CassandraClient:
    def __init__(self):
        self.cluster, self.session = get_session()
        self.lock = threading.Lock()
    
    def book_exists(self, book_id):
        query = SimpleStatement(
            "SELECT id FROM books WHERE id=%s"
        )
        result = self.session.execute(query, (book_id,))
        return result.one() is not None

    def is_book_reserved(self, book_id):
        query = SimpleStatement(
            "SELECT id FROM reservations WHERE book_id=%s AND status='active' ALLOW FILTERING"
        )
        result = self.session.execute(query, (book_id,))
        return result.one() is not None
    
    def make_reservation(self, user_id, book_id):
        with self.lock:
            if not self.book_exists(book_id):
                return None  # Book does not exist
            
            if self.is_book_reserved(book_id):
                return None  # Book is already reserved
            
            reservation_id = uuid.uuid4()
            reservation_date = datetime.now()
            status = 'active'
            
            query = SimpleStatement(
                "INSERT INTO reservations (id, user_id, book_id, reservation_date, status) VALUES (%s, %s, %s, %s, %s)"
            )
            self.session.execute(query, (reservation_id, user_id, book_id, reservation_date, status))
            return reservation_id
    
    def update_reservation(self, reservation_id, new_date):
        query = SimpleStatement(
            "UPDATE reservations SET reservation_date=%s WHERE id=%s"
        )
        self.session.execute(query, (new_date, reservation_id))
    
    def get_reservation(self, reservation_id):
        query = SimpleStatement(
            "SELECT * FROM reservations WHERE id=%s"
        )
        result = self.session.execute(query, (reservation_id,))
        return result.one()

    def get_reservation_by_book_id(self, book_id):
        query = SimpleStatement(
            "SELECT * FROM reservations WHERE book_id=%s AND status='active' ALLOW FILTERING"
        )
        result = self.session.execute(query, (book_id,))
        return result.one()
    
    def cancel_reservation(self, reservation_id):
        query = SimpleStatement(
            "DELETE FROM reservations WHERE id=%s"
        )
        self.session.execute(query, (reservation_id,))
    
    def get_books(self):
        query = SimpleStatement(
            "SELECT * FROM books"
        )
        result = self.session.execute(query)
        return result.all()
    
    def get_all_reservations(self):
        query = SimpleStatement(
            "SELECT * FROM reservations"
        )
        result = self.session.execute(query)
        return result.all()

    def delete_all_reservations(self):
        query = SimpleStatement(
            "TRUNCATE reservations"
        )
        self.session.execute(query)

    def insert_book(self, book_id, title, author, published_date):
        query = SimpleStatement(
            "INSERT INTO books (id, title, author, published_date) VALUES (%s, %s, %s, %s)"
        )
        self.session.execute(query, (book_id, title, author, published_date))

    def delete_book(self, book_id):
        query = SimpleStatement(
            "DELETE FROM books WHERE id=%s"
        )
        self.session.execute(query, (book_id,))
