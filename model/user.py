from database.connect import connect_to_database

conn = connect_to_database()
cursor = conn.cursor(dictionary=True)
def get_user(username):    
    query = "SELECT * FROM user WHERE user_name = %s"
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    return user

def registers(username, name, email, password):
    query = "INSERT INTO user (user_name, name, email, password, role) VALUES (%s, %s, %s, %s, 'user')"
    cursor.execute(query, (username, name, email, password))
    conn.commit()

def create_history(filename, userId, type, module, acs):
    query = "INSERT INTO history (file_name, user_id, status, module, acs) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (filename, userId, type, module, acs))
    conn.commit()

def get_history(userId):
    query = "SELECT * FROM history WHERE user_id = %s and deleted_at is null"
    cursor.execute(query, (userId,))
    history = cursor.fetchall()
    return history

def change_pass(newPassword,userId):
    query = "UPDATE user SET password = %s WHERE id = %s"
    cursor.execute(query, (newPassword,userId))
    conn.commit()

def get_accounts(userId):
    query = "SELECT * FROM user WHERE id <> %s"
    cursor.execute(query, (userId,))
    accounts = cursor.fetchall()
    return accounts

def create_account(username, name, email, password, role):
    query = "INSERT INTO user (user_name, name, email, password, role) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (username, name, email, password, role))
    conn.commit()

def delete_user(userId):
    query = "DELETE FROM user WHERE id = %s"
    cursor.execute(query, (userId,))
    conn.commit()

def edit_user(userId, username=None, email=None, name=None , password=None, role=None): 
    query = "UPDATE user SET "
    params = []

    if username:
        query += "user_name = %s, "
        params.append(username)
    if email:
        query += "email = %s, "
        params.append(email)
    if name:
        query += "name = %s, "
        params.append(name)
    if password:
        query += "password = %s, "
        params.append(password)
    if role:
        query += "role = %s"
        params.append(role)

    query += " WHERE id = %s"
    params.append(userId)
    cursor.execute(query, params)
    conn.commit()