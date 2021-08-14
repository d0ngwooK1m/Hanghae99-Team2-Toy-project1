from flask import Flask, jsonify, request
from passlib.hash import pbkdf2_sha256
from app import db
import uuid

class User():
    def signup(self):
        print(request.form)

        # Create the user object
        user = {
            "_id": uuid.uuid4().hex,
            "name": request.form.get('s_name'),
            "email": request.form.get('s_email'),
            "password": request.form.get('s_password')
        }

        # Check the password
        if user["password"] != request.form.get('s_check_password'):
            return jsonify({ "error": "Check your password again" }), 400

        # Encrypt the password
        user["password"] = pbkdf2_sha256.encrypt(user["password"])

        # Check for existing email address
        if db.users.find_one({ "email": user["email"] }):
            return jsonify({ "error": "Email address already in use" }), 400

        db.users.insert_one(user)

        return jsonify(user), 200