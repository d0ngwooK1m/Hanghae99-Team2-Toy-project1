from flask import Flask, jsonify, request, session, redirect
from passlib.hash import pbkdf2_sha256
from app import db
import uuid

class User():

    def start_session(self, user):
        session['logged_in'] = True
        session['user'] = user
        return jsonify(user), 200

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

        if db.users.insert_one(user):
            return self.start_session(user)

        return jsonify({ "error": "Signup failed" }), 400

    def logout(self):
        session.clear()
        return redirect('/')

    def login(self):
        user = db.users.find_one({
            "email": request.form.get("l_email")
        })

        if user and pbkdf2_sha256.verify(request.form.get("l_password"), user["password"]):
            return self.start_session(user)

        return jsonify({ "error": "Invalid login credentials" }), 400