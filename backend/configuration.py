class ApplicationConfig:
    SECRET_KEY = 'qazwsxedcrfvtgbyhnujmikolp'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///backend/database.db"

    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True