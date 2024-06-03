DROP KEYSPACE IF EXISTS library;

CREATE KEYSPACE IF NOT EXISTS library WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE library;

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY,
  title text,
  author text,
  published_date date,
  pages int
);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), '1984', 'George Orwell', '1949-06-08', 328);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'To Kill a Mockingbird', 'Harper Lee', '1960-07-11', 281);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Great Gatsby', 'F. Scott Fitzgerald', '1925-04-10', 180);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Count of Monte Cristo', 'Alexandre Dumas', '1844-08-28', 1276);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'Flowers for Algernon', 'Daniel Keyes', '1959-03-01', 311);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'Wrony', 'Petra Dvořáková, Mirosław Śmigielski', '2020-11-23', 184);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'A Man Called Ove', 'Fredrik Backman, Alicja Roseneau', '2022-12-07', 352);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'Winter Garden', 'Kristin Hannah, Joanna Puchalska', '2014-04-02', 368);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Night Circus', 'Erin Morgenstern, Patryk Gołębiowski', '2012-10-17', 432);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Unbearable Lightness of Being', 'Milan Kundera', '2006-11-30', 236);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'Pride and Prejudice', 'Jane Austen, Anna Quindlen', '2000-10-10', 279);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Shadow of the Wind', 'Carlos Ruiz Zafón, Beata Fabjańska-Potapczuk', '2007-10-31', 520);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Secret History', 'Donna Tartt, Jerzy Kozłowski', '2015-10-05', 608);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'My Dark Vanessa', 'Kate Elizabeth Russell, Robert Sudoł', '2020-06-17', 440);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), '27 Deaths of Toby Obed', 'Joanna Gierak-Onoszko', '2019-05-22', 343);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Vanishing Half', 'Brit Bennett', '2020-06-02', 343);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'A Little Life', 'Hanya Yanagihara, Jolanta Kozak', '2016-04-27', 814);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'This is Going to Hurt', 'Adam Kay, Katarzyna Dudzik', '2018-06-06', 312);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'The Copenhagen Trilogy', 'Tove Ditlevsen, Iwona Zimnicka', '2021-08-25', 368);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'Aristotle and Dante Discover the Secrets of the Universe', 'Benjamin Alire Sáenz, Agnieszka Brodzik', '2021-08-11', 384);

INSERT INTO books (id, title, author, published_date, pages)
VALUES (uuid(), 'I Am Pilgrim', 'Terry Hayes, Maciej Szymański', '2014-05-20', 760);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY,
  user_id UUID,
  book_id UUID,
  reservation_date timestamp
);

CREATE INDEX IF NOT EXISTS ON reservations (book_id);
CREATE INDEX IF NOT EXISTS ON reservations (user_id);