CREATE KEYSPACE IF NOT EXISTS library WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE library;

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY,
  title text,
  author text,
  published_date date
);

INSERT INTO books (id, title, author, published_date) VALUES (uuid(), '1984', 'George Orwell', '1949-06-08');
INSERT INTO books (id, title, author, published_date) VALUES (uuid(), 'To Kill a Mockingbird', 'Harper Lee', '1960-07-11');
INSERT INTO books (id, title, author, published_date) VALUES (uuid(), 'The Great Gatsby', 'F. Scott Fitzgerald', '1925-04-10');

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY,
  user_id UUID,
  book_id UUID,
  reservation_date timestamp,
  status text
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username text,
  password text
);

INSERT INTO users (id, username, password) VALUES (uuid(), 'admin', 'admin');