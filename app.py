from flask import Flask, render_template, jsonify, request
import requests
# from bs4 import BeautifulSoup
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
    soup = BeautifulSoup(data.text, 'html.parser')
    image = soup.select_one('meta[property="og:image"]')['content']
    return jsonify(image)

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
