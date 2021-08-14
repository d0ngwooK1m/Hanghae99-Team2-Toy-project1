from flask import Flask, render_template, jsonify, request
import requests
import pymongo


# from bs4 import BeautifulSoup
app = Flask(__name__)

# Database
client = pymongo.MongoClient('localhost', 27017)
db = client.user_login_system

# Routes
from user import routes


@app.route('/')
def index():
    return render_template('main.html')


@app.route('/myPage')
def mypage():
    return render_template('myPage.html')


@app.route('/view', methods=['GET'])
def show_view():
   lists = list(db.posting.find({},{'_id':False}))
   return jsonify({'all_post':lists})
  


@app.route('/test', methods=['POST'])
def posting():
    url_receive = request.form['url_give']
    title_receive = request.form['title_give']
    desc_receive = request.form['desc_give']

    doc = {
        'url':url_receive,
        'title':title_receive,
        'desc':desc_receive
    }
    db.posting.insert_one(doc)
    return jsonify({'msg': '등록 완료!'})


@app.route('/create/previewImage',methods=['POST'])
def previewImage():
    url_receive = request.form['url_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    # soup = BeautifulSoup(data.text, 'html.parser')
    # image = soup.select_one('meta[property="og:image"]')['content']
    # return jsonify(image)

# 켜기 터미널
# set FLASK_APP=app.py
# set FLASK_ENV=development
# flask run
# 끄기 터미널에서 ctrl c