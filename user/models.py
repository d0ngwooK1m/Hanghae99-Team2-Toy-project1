from flask import Flask, jsonify, request, session, redirect
from passlib.hash import pbkdf2_sha256

import app
from app import db, SECRET_KEY
import jwt
import datetime
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
            return jsonify({ "error": "비밀번호가 다릅니다." }), 400

        # Encrypt the password
        user["password"] = pbkdf2_sha256.encrypt(user["password"])

        # Check for existing email address
        if db.users.find_one({ "email": user["email"] }):
            return jsonify({ "error": "이미 사용되고 있는 이메일 입니다." }), 400

        if db.users.insert_one(user):
            return self.start_session(user)

        return jsonify({ "error": "회원가입 실패" }), 400

    def logout(self):
        return jsonify({ "result": "success" }), 200

    def login(self):
        user = db.users.find_one({
            "email": request.form.get("l_email")
        })

        if user is not None and pbkdf2_sha256.verify(request.form.get("l_password"), user["password"]):
            payload = {
                'email': user['email'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=100)

            }

            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

            return jsonify({ "success": True, "message": "로그인 성공!", "login_token": token }), 200

        return jsonify({ "error": "로그인 실패" }), 400