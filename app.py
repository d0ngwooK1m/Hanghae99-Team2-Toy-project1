from flask import Flask, render_template, jsonify, request, session, redirect, url_for, flash
import requests
import pymongo
import jwt
import uuid
import datetime
# import beautifulsoup4


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
            db.posting.delete_one({'id': id_receive})
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

@app.route('/myPage/list', methods=['GET'])
def mypage_list():
    token_receive = request.cookies.get('login_token')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    token_email = payload['email']
    lists = list(db.posting.find({'email': token_email}, {'_id': False}))
    print("mypage lists = ", lists)
    return jsonify({'my_list': lists})


@app.route('/view', methods=['GET'])
def show_view():
    lists = list(db.posting.find({}, {'_id': False}).sort('uploadtime',-1))
    return jsonify({'all_post': lists})


@app.route('/test', methods=['POST'])
def posting():
    token_receive = request.cookies.get('login_token')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

    url_receive = request.form['url_give']
    title_receive = request.form['title_give']
    desc_receive = request.form['desc_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    image = soup.select_one('meta[property="og:image"]')['content']
    token_email = payload['email']
    now = datetime.datetime.now()
    now_date_time = now.strftime("%Y%m%d%H%M%S")
    # og:image가 없어서 제대로 크롤링 못할 경우, 기본 이미지로 예외처리
    if image.split("/")[1] == "static" or image == "":
        image = "../static/img/linkgather.png"
    doc = {
        "id": uuid.uuid4().hex,
        'url': url_receive,
        'title': title_receive,
        'desc': desc_receive,
        'likes': 0,
        'heart': './static/img/heart.svg',
        'Jjim':True,
        'uploadtime': now_date_time,
        'email': token_email,
        'imgsrc': image
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

    id_receive = request.form['id_give']
    # img_receive = request.form['img_give']
    url_receive = request.form['url_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    img_receive = soup.select_one('meta[property="og:image"]')['content']
    title_receive = request.form['title_give']
    desc_receive = request.form['desc_give']
    # og:image가 없어서 제대로 크롤링 못할 경우, 기본 이미지로 예외처리
    if img_receive.split("/")[1] == "static":
        img_receive = "../static/img/linkgather.png"
        
    print(id_receive, url_receive, title_receive, desc_receive)
    db.posting.update_one({'id': id_receive}, {'$set': {'url': url_receive, 'title': title_receive, 'desc': desc_receive, 'imgsrc': img_receive}})
    return jsonify({ "response": "수정 완료!"})


@app.route('/search', methods=['GET'])
def view_Search():
    try:
        tokenExist = checkExpired()

    except jwt.ExpiredSignatureError:
        tokenExist=True
    except jwt.exceptions.DecodeError:
        tokenExist=True

    text = request.args.get('text')
    #text는 form으로 데이터를 받음
    splitted_keywords = text.split(' ')
    #text를 공백으로 나눠서 여러가지가 검색될수 있도록함 이때 split된 데이터는 딕셔너리로 만들어짐
    print(splitted_keywords)
    pipelines = list()
    pipelines.append({
        '$sample':{'size':1}
    })
    print(pipelines)
    search_R = list(db.posting.aggregate(pipelines))
    print(search_R)

    sep_keywords = []
    for string in splitted_keywords:
        sep_keywords.append({'$or':[
            {'title':{'$regex':string}},
            {'desc':{'$regex':string}}
        ]})
    print(sep_keywords)

    search = list(db.posting.find({"$or":sep_keywords},{'_id':False}).sort('uploadtime',-1))
    print(search)
    if text == "":
        return render_template('search.html', keywords=splitted_keywords, search=search_R, token=tokenExist)
    else :
        return render_template('search.html', keywords=splitted_keywords, search=search, token=tokenExist)


@app.route('/create/previewImage', methods=['POST'])
def previewImage():
    url_receive = request.form['url_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    image = soup.select_one('meta[property="og:image"]')['content']
    return jsonify(image)

# 추천하기 기능구현


@app.route('/update/likes', methods=['POST'])
def updateLikes():
    id_receive = request.get_json()
    find_id = id_receive['id_give']
    find_list = db.posting.find_one({'id': find_id})
    target_like = find_list['likes']
    new_like = target_like + 1
    db.posting.update_one({'id': find_id}, {'$set': {'likes': new_like}})
    return jsonify({'msg': "추천되었습니다."})

@app.route('/update/jjim', methods=['POST'])
def updatejjim():
    # base jjim에서 id_give로 id값(52dfb19125fb4d1f8021d7281b56ca04)을 받아와 변수로 지정
    id_receive = request.form['id_give']
    # db에서 해당 id값이 있는 자료를 찾아줌 
    target = db.posting.find_one({'id':id_receive})
    # id값이 속해있는 자료의 jjim 값을 변수로 지정 >> 처음 글 등록시 true 값을 가짐 
    target_Heart = target['Jjim']
    # True가 false로 바뀜
    target_Heart = not(target_Heart)
    # jjim이 true일 경우 heart(이미지 경로)에 테두리만 있는 하트의 경로를 내려주고
    if target_Heart:
        Heart = '../static/img/heart.svg'
        msg = '찜하기 취소!'
    else:
        Heart = '../static/img/rheart.svg'
        msg = '찜하기 완료!'
    print(Heart)
    db.posting.update_one({'id':id_receive}, {'$set': {'heart':Heart, 'Jjim':target_Heart}})
    
    return jsonify({'msg':msg })    
# 켜기 터미널
# set FLASK_APP=app.py
# set FLASK_ENV=development
# flask run
# 끄기 터미널에서 ctrl c


# if __name__ == '__main__':
#     app.run('0.0.0.0', port=5000, debug=True)
