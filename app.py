from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import requests
import pymongo
import jwt


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
  
@app.route('/search', methods=['GET'])
def view_Search():
    text = request.args.get('text')
    #text는 form으로 데이터를 받음
    splitted_keywords = text.split(' ')
    #text를 공백으로 나눠서 여러가지가 검색될수 있도록함 이때 split된 데이터는 딕셔너리로 만들어짐
    print(splitted_keywords)
    sep_keywords_T=[]
    sep_keywords_D=[]
    for string in splitted_keywords:
        sep_keywords_T.append({"title":string})
        #title이 검색어와 일치하는 것만 sep_keywords_T에 저장
        sep_keywords_D.append({"$and":[
            {'$or': [{"desc":{"$regex": string}},{"title":{"$regex": string}}]},
            {'$or':[{"title":{'$ne': string}}]}
        ]})
        #desc에 검색어가 포함되어있는것과 title에 검색어가 포함되어있는것들중
        #title이 검색어와 정확히 일치하는것을 제외하고 sep_keywords_D에 저장
    print(sep_keywords_T)
    print(sep_keywords_D)

    search_T = list(db.posting.find({"$or":sep_keywords_T},{'_id':False}))
    search_D = list(db.posting.find({"$or":sep_keywords_D},{'_id':False}))
    print(search_T)
    print(search_D)
    return render_template('search.html', search_T=search_T, search_D=search_D)
    #일치하는것들을 각각 search_T, search_D로 불러서 jinja2 템플릿으로 정보를 전달


@app.route('/create/previewImage',methods=['POST'])
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


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
