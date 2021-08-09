from flask import Flask, render_template, jsonify, request
import requests
from bs4 import BeautifulSoup
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

@app.route('/create/previewImage',methods=['POST'])
def previewImage():
    url_receive = request.form['url_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    image = soup.select_one('meta[property="og:image"]')['content']
    return jsonify(image)

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
