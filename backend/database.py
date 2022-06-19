from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

class User(db.Model):
    __tablename__ = 'user'
    userId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(50), unique=True , nullable=False)
    password = db.Column(db.String(100) , nullable=False)
    notes = db.relationship('Note', backref='user', lazy=True)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('userId' , 'username' , 'email')

user_schema = UserSchema()

class Note(db.Model):
    __tablename__ = 'note'
    noteId = db.Column(db.Integer, primary_key=True)
    noteHead = db.Column(db.String(40), nullable=False)
    noteBody = db.Column(db.Text) 
    noteBelongsTo = db.Column(db.Integer, db.ForeignKey('user.userId'), nullable=False)

class NoteSchema(ma.Schema):
    class Meta:
        fields = ('noteId', 'noteHead', 'noteBody')

note_schema = NoteSchema()
notes_schema = NoteSchema(many=True)