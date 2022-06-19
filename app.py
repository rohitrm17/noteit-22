from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from flask_session import Session
from backend.configuration import ApplicationConfig
from werkzeug.security import generate_password_hash, check_password_hash
from backend.database import db, User, user_schema, Note, note_schema, notes_schema

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/@me', methods=['GET'])
def getCurrentUser():
    userId = session.get("userId")
    
    if not userId:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(userId=userId).first()

    return user_schema.jsonify(user)

@app.route('/api/signUp' , methods=['POST'])
def signUp():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    
    userExists = User.query.filter_by(email=email).first() is not None

    if userExists:
        return jsonify({"error": "User already exists"}), 409

    hashedPassword = generate_password_hash(password)
    newUser = User(username=username, email=email, password=hashedPassword)
    db.session.add(newUser)
    db.session.commit()
     
    session["userId"] = newUser.userId

    return user_schema.jsonify(newUser)

@app.route('/api/login' , methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({ "error": "Unauthorized" }), 401

    if not check_password_hash (user.password, password):
        return jsonify({ "error": "Unauthorized" }), 401
    
    session["userId"] = user.userId

    return user_schema.jsonify(user)

@app.route("/api/logout", methods=["POST"])
def logout_user():
    session.pop("userId")
    return "200"

@app.route("/api/addnote", methods=['POST'])
def addNote():
    userId = session.get("userId")
    
    if not userId:
        return jsonify({"error": "Unauthorized"}), 401
        
    noteHead = request.json['noteHead']
    noteBody = request.json['noteBody']
    noteBelongsTo = session['userId']

    newNote = Note(noteHead=noteHead, noteBody=noteBody, noteBelongsTo=noteBelongsTo)
    db.session.add(newNote)
    db.session.commit()

    return note_schema.jsonify(newNote)

@app.route('/api/deletenote/<noteId>' , methods=['DELETE'])
def deleteNote(noteId):
    delNote = Note.query.get(noteId)

    db.session.delete(delNote)
    db.session.commit()

    return note_schema.jsonify(delNote)

@app.route('/api/updatenote/<noteId>' , methods=['PUT'])
def updateNote(noteId):
    upNote = Note.query.get(noteId)
    
    upNote.noteHead = request.json['noteHead']
    upNote.noteBody = request.json['noteBody']

    db.session.commit()

    return note_schema.jsonify(upNote)


@app.route('/api/@mynotes')
def getMyNotes():
    userId = session.get("userId")
    
    if not userId:
        return jsonify({"error": "Unauthorized"}), 401
    
    allNotes = Note.query.filter_by(noteBelongsTo=userId)

    return notes_schema.jsonify(allNotes)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True , port=8000)