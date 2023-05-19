from flask import Flask, request, redirect, url_for,session, render_template,jsonify
import os
from sqlalchemy import create_engine
import mysql.connector
from datetime import datetime
connection = mysql.connector.connect(host='localhost',
                                             user='root',
                                             password='',
                                             database='missing_person')


engine = create_engine('mysql+mysqlconnector://root:@localhost/student_exam_managemet')


app=Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'

@app.route('/')
def main():
    return render_template('main.html')


@app.route('/form_submission',methods=['POST'])
def form_submision():

    print(request.form)

    name=request.form['name']
    age=request.form['age']
    dob=request.form['dob']
    last_location=request.form['location']
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    file=request.files["photo"]
    filename = request.form['name']+'.jpg'
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    cursor = connection.cursor()
    cursor.execute(cursor.execute('''INSERT INTO missing_person (name,age,dob,last_location,image_path,date_time) 
    VALUES (%s, %s, %s, %s,%s, %s)''', (name,age,dob,last_location,filepath,timestamp)))
    connection.commit()
    # cursor.close()
    return redirect(url_for('main'))


@app.route('/images')
def images():
    return render_template('images.html')


@app.route('/imagesret', methods=['GET'])
def get_images():
    # Implement your logic to retrieve image URLs from the server
    images = [
        '/static/uploads/bill.jpg',
        '/static/uploads/joe.jpg',
    ]
    return jsonify(images)

@app.route('/check')
def check():
    

if __name__ == '__main__':
    app.run()
