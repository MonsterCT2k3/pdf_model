from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from feature_extraction import feature_extraction
from module import random_forest, SVM, LR, KNN, DT
from model.user import get_user, registers, create_history, get_history, change_pass, get_accounts, create_account, delete_user,edit_user
app = Flask(__name__)

isLogin = False
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def index():
    return render_template('index.html', isLogin=isLogin)

@app.route('/predict', methods=['POST'])
def predict():
    module = request.form['module-select']

    if 'file' not in request.files:
        return jsonify({'error': 'Không có phần tập tin'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Chưa chọn file'})
    
    if file:
        path = 'storage/' +file.filename
        file.save(path)
        features = feature_extraction(path)
        if module == 'RandomForest':
            result = random_forest(features)
        elif module == 'SVM':
            result = SVM(features)
        elif module == 'LogisticRegression':
            result = LR(features)
        elif module == 'KNeighbors':
            result = KNN(features)
        else:
            result = DT(features)

        if session.get('id_user'):
            create_history(file.filename, session.get('id_user'), result[1][0], module, result[0])
        return jsonify({'result': str(result[1][0]), 'acs': result[0], 'precision' : result[2], 'recall' : result[3], 'f1' : result[4],'module': module, 'feature': features})

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = get_user(username)
        
        if user and user['password'] == password:
            session['id_user'] = user['id']
            session['password'] = user['password']
            session['name'] = user['name']
            session['role'] = user['role']
            global isLogin
            isLogin = True
            return redirect(url_for('index'))
        else:   
            return render_template('login.html', error='Tên đăng nhập hoặc mật khẩu không đúng')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('id_user', None)
    session.pop('name', None)
    global isLogin
    isLogin = False
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        passConfirm = request.form['password_confirmation']
        print(name, email, password, passConfirm)
        if get_user(username):
            return render_template('register.html', error='Tên đăng nhập đã được sử dụng')

        if password == passConfirm: 
            registers(username, name, email, password)
            return redirect(url_for('login'))
        else:
            return render_template('register.html', error='Mật khẩu không trùng khớp')
    return render_template('register.html')

@app.route('/history')
def history():
    userId = session.get('id_user')
    if userId:
        history = get_history(userId)
    return render_template('history.html', histories=history)

@app.route('/account')
def account():
    userId = session.get('id_user')
    if userId:
        account = get_accounts(userId)

    return render_template('account.html', accounts=account)

@app.route('/change-password', methods=['POST'])
def change_password():
    old_password = request.form.get("old_pass", False)
    new_password = request.form.get("new_pass", False)
    confirm_password = request.form.get('confirm_pass', False)
    userId = session.get('id_user')

    if old_password == session['password']:
        if new_password == confirm_password:
            change_pass(new_password,userId)
            return jsonify({'message': 'success'})
        else:
            return jsonify({'error': 'Mật khẩu mới và mật khẩu xác nhận không khớp'})
    else:
        return jsonify({'error': 'Mật khẩu cũ không đúng'})

@app.route('/create-user', methods=['POST'])
def create_user():
    user_name = request.form.get("user_name", False)
    name = request.form.get("name", False)
    email = request.form.get('email', False)
    role = request.form.get('role', False)
    password = request.form.get('password', False)
    confirm_password = request.form.get('confirm_password', False)
    if password != confirm_password:
        return jsonify({"error": "Mật khẩu không trùng khớp"})
    if len(password) < 6:
        return jsonify({"error": "Mật khẩu phải có tối thiểu 6 kí tự"})
    if role == '':
        return jsonify({"error": "Quyền là bắt buộc"})

    create_account(user_name, name, email, password, role)
    return jsonify({'message': 'Thành công'})

@app.route('/edit-account/<id>', methods=['POST'])
def edit_account(id):
    username = request.form.get('user_name')
    name = request.form.get('name')
    email = request.form.get('email')
    role = request.form.get('role')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if password != confirm_password:
        return jsonify({"error": "Mật khẩu không trùng khớp"})
    
    edit_user(id, username, email, name, password, role)
    return jsonify({'message': 'Thành công'})

@app.route('/delete-account/<id>', methods=['POST'])
def delete_account(id):
    delete_user(id)
    return jsonify({'id': id})
    
if __name__ == '__main__':
    app.run(debug=True)