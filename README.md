# Library Reservation System

## Description

The Library Reservation System is a web application that allows users to browse available books, make reservations, view their reservations, update reservation dates, and cancel reservations. The application is built using Flask for the backend, Cassandra for the database, and Bootstrap for the frontend. The system also supports stress testing with various scenarios to ensure robustness and reliability.

## Features

- View a list of available books.
- Make a reservation for a book.
- View your reservations with options to update or cancel.
- View details of specific reservations.
- View books currently reserved by others.
- Stress testing features to simulate high load scenarios.

## Requirements

- Python 3.8 or higher
- Docker
- Docker Compose

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/library-reservation-system.git
   cd library-reservation-system

2. **Set up the Python environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

3. **Start the Cassandra cluster using Docker Compose:**
    ```bash
    docker-compose up -d

4. **Run the setup script to initialize the Cassandra database:**
    ```bash
    docker exec -it cassandra1 cqlsh -f /setup.cql

5. **Start the Flask application:**
    ```bash
    python app.py

## Usage

- Open your browser and navigate to `http://localhost:5000` to access the Library Reservation System.
- Browse the available books and make reservations as needed.
- Use the stress testing notebook to simulate high load scenarios and test the system's performance.

    
