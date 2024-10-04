import mysql.connector

def connect_to_database():
    # host = 'localhost'
    # user = 'root'
    # password = ''
    # database = 'detect'

    # conn = mysql.connector.connect(host=host, user=user, password=password, database=database)
    connection = mysql.connector.connect(
        user="root",
        password="trong123",
        host="localhost",
        port="3306",
        database="kma_pdf"
    )
    return connection

