from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.dbsparta

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/my_page')
def mypage():
    return render_template('my_page.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
