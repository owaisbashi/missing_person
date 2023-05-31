from flask import Flask, request, redirect, url_for,session, render_template,jsonify
import os
import pandas as pd
import face_recognition
import cv2
import numpy as np
from sqlalchemy import create_engine
import mysql.connector
from datetime import datetime
import geocoder
import os

connection = mysql.connector.connect(host='localhost',
                                             user='root',
                                             password='',
                                             database='missing_person')


engine = create_engine('mysql+mysqlconnector://root:@localhost/missing_person')


app=Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'

@app.route('/')
def main():
    return render_template('main.html')

def get_place_from_coordinates(latitude, longitude):
    location = geocoder.osm([latitude, longitude], method='reverse')
    
    if location.ok:
        return location.address
    else:
        return "No results found for the given coordinates."


@app.route('/donation')
def donation():
    return render_template('donation.html')

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

    folder_path = "static/uploads"  # Path to the "uploads" folder within the "static" folder

# Get the list of file names in the folder
    file_names = os.listdir(folder_path)

    file_paths = [os.path.join(folder_path, file_name) for file_name in file_names]

    print(file_paths)

    return jsonify(file_paths)

@app.route('/check',methods=['POST'])
def check():
    # latitude = request.form.get('latitude')
    # longitude = request.form.get('longitude')
    # print(latitude,longitude)
    # # Process the geolocation data as needed

    # # Process the uploaded image
    print(request.files)
    latitude_file = request.files['latitude']
    latitude = latitude_file.read().decode('utf-8')

    # Get the longitude file
    longitude_file = request.files['longitude']
    longitude = longitude_file.read().decode('utf-8')

    image=request.files['image']

    target_image= face_recognition.load_image_file(image)
    target_face_encodings = face_recognition.face_encodings(target_image)[0]


    db_image_paths=pd.read_sql_query('''select image_path from missing_person''',engine)['image_path'].tolist()

    db_images=[]
    db_images_encodings=[]
    for i in db_image_paths:
        print(i)
        img=face_recognition.load_image_file(i)
        db_images.append(img)
        db_images_encodings.append(face_recognition.face_encodings(img)[0])

    known_face_encodings=db_images_encodings
    known_face_names=pd.read_sql_query('''select name from missing_person''',engine)['name'].tolist()
    
    results = face_recognition.compare_faces(known_face_encodings, target_face_encodings)

    

    matching_names = [known_face_names[i] for i, result in enumerate(results) if result]
    
    print('results',matching_names)
    name_str = ' '.join(matching_names)

    print(name_str)

    place = get_place_from_coordinates(latitude, longitude)
    print(place)
    # image = request.files['imageInput']
    # # ...

    return {'message': f'{name_str}','place':place}

if __name__ == '__main__':
    app.run()
