
from flask import Flask, render_template, jsonify, request, session, redirect, url_for, flash
import requests
import pymongo
import jwt
import uuid
import datetime


from bs4 import BeautifulSoup
app = Flask(__name__)
app.secret_key = b'\x8e\xbf(\x11\xfb\x80\xa4<\xd9\xc9\x95\x10\xcf\x85Q\xd1'
SECRET_KEY = 'LinkGather'

# Database
client = pymongo.MongoClient('localhost', 27017)
db = client.linkgather

# Authentication


def checkExpired():
    if request.cookies.get('login_token') is not None:
        return False
    else:
        return True


def userAuthCheck(str):
    token_receive = request.cookies.get('login_token')
    try:
        tokenExist = checkExpired()

        if not token_receive:
            return render_template('main.html', token=tokenExist)
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        user_info = db.users.find_one({"email": payload["email"]})
        if user_info:
            return render_template(str, token=tokenExist), print(tokenExist)

    except jwt.ExpiredSignatureError:
        return redirect(url_for('fail', msg="로그인 시간 만료"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for('fail', msg="로그인 정보 없음"))


def editAuthCheck(type):
    token_receive = request.cookies.get('login_token')

    if type == "GET":
        id_receive = request.args.get('id_give')
    elif type == "POST":
        id_receive = request.form['id_give']

    detail = list(db.posting.find({"id": id_receive}, {"_id": False}))
    if detail != []:
        check = db.posting.find_one({"email": detail[0]["email"]})
    else:
        check = ""
    # print(detail)
    try:
        if not token_receive:
            return jsonify({"response": "권한 없음"}), 400

        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload["email"]})
        print(user_info['email'], check['email'])

        if user_info['email'] == check['email'] and type == "GET":
            return jsonify({"response": detail}), 200
        elif user_info['email'] == check['email'] and type == "POST":
            db.posting.delete_one({'email': check['email']})
            return jsonify({"response": '삭제 완료!'}), 200
        else:
            return jsonify({"response": "권한 없음"}), 400

    except jwt.ExpiredSignatureError:
        return jsonify({"response": "로그인 시간 만료"}), 400
    except jwt.exceptions.DecodeError:
        return jsonify({"response": "로그인 정보 없음"}), 400


# Routes
from user import routes

@app.route('/')
def index():
    return userAuthCheck("main.html")


@app.route('/fail')
def fail():
    return render_template('main.html')


@app.route('/myPage')
# @login_required
def mypage():
    return userAuthCheck("myPage.html")


@app.route('/view', methods=['GET'])
def show_view():
    lists = list(db.posting.find({}, {'_id': False}))
    return jsonify({'all_post': lists})


@app.route('/test', methods=['POST'])
def posting():
    token_receive = request.cookies.get('login_token')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

    url_receive = request.form['url_give']
    title_receive = request.form['title_give']
    desc_receive = request.form['desc_give']
    token_email = payload['email']
    now = datetime.datetime.now()
    now_date_time = now.strftime("%Y%m%d%H%M%S")
    print("now_date_time = ", now_date_time)
    doc = {
        "id": uuid.uuid4().hex,
        'url': url_receive,
        'title': title_receive,
        'desc': desc_receive,
        'likes': 0,
        'heart': 0,
        'uploadtime': now_date_time,
        'email': token_email
    }
    db.posting.insert_one(doc)
    return jsonify({'msg': '등록 완료!'})


@app.route('/test/detail', methods=['GET'])
def detail():
    id_receive = request.args.get('id_give')
    detail = list(db.posting.find({"id": id_receive}, {"_id": False}))
    # print(id_receive, detail)
    return jsonify({"response": detail})


@app.route('/test/edit', methods=['GET'])
def edit():
    return editAuthCheck("GET")


@app.route('/test/delete', methods=['POST'])
def delete():
    return editAuthCheck("POST")


@app.route('/test/submitEdit', methods=['POST'])
def submitEdit():
    id_receive = request.form['id']
    url_receive = request.form['url']
    title_receive = request.form['title']
    desc_receive = request.form['description']
    db.posting.update_one({'id': id_receive}, {
                          '$set': {'url': url_receive, 'title': title_receive, 'desc': desc_receive}})
    # print(id_receive, detail)
    return render_template("main.html")


@app.route('/search', methods=['GET'])
def view_Search():
    text = request.args.get('text')
    # text는 form으로 데이터를 받음
    splitted_keywords = text.split(' ')
    # text를 공백으로 나눠서 여러가지가 검색될수 있도록함 이때 split된 데이터는 딕셔너리로 만들어짐
    print(splitted_keywords)
    sep_keywords_T = []
    sep_keywords_RT = []
    sep_keywords_D = []
    for string in splitted_keywords:
        sep_keywords_T.append({"title": string})
        # title이 검색어와 일치하는 것만 sep_keywords_T에 저장
        sep_keywords_RT.append({'$and': [
            {"title": {'$ne': string}},
            {"title": {'$regex': string}},
            {"desc": {'$ne': {'$regex': string}}}
        ]})
        # title이 검색어가 포함되어있는 것 중 desc에 검색어가 없는 것
        sep_keywords_D.append({"$and": [
            {"desc": {'$regex': string}},
            {"title": {'$not': {'$regex': string}}}
        ]})
        # desc에 검색어가 포함되어있는것 중
        # title이 검색어와 포함되는 것을 제외하고 sep_keywords_D에 저장
    print(sep_keywords_T)
    print(sep_keywords_RT)
    print(sep_keywords_D)

    search_T = list(db.posting.find({"$or": sep_keywords_T}, {'_id': False}))
    search_RT = list(db.posting.find({"$or": sep_keywords_RT}, {'_id': False}))
    search_D = list(db.posting.find({"$or": sep_keywords_D}, {'_id': False}))
    print(search_T)
    print(search_RT)
    print(search_D)
    return render_template('search.html', search_T=search_T, search_D=search_D, search_RT=search_RT,
                           keywords=splitted_keywords)
    # 일치하는것들을 각각 search_T, search_D로 불러서 jinja2 템플릿으로 정보를 전달


@app.route('/create/previewImage', methods=['POST'])
def previewImage():
    url_receive = request.form['url_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    image = soup.select_one('meta[property="og:image"]')['content']
    return jsonify(image)

# 켜기 터미널
# set FLASK_APP=app.py
# set FLASK_ENV=development
# flask run
# 끄기 터미널에서 ctrl c


# if __name__ == '__main__':
#     app.run('0.0.0.0', port=5000, debug=True)
