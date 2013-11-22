from . import app, mongo
from server.utils.utils import action_success, action_fail, check_required, get_creation_date, timestamp
from flask import request,render_template,redirect,url_for
from functools import wraps

def form_require(required_args):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            missing_fields = check_required(required_args, request.form)
            if missing_fields:
                return action_fail({"missing_fields" : missing_fields}, 422,
                        message="required fields are missing")
            else:
                return f(*args, **kwargs)
        return decorated_function
    return decorator

def url_require(required_args):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            missing_fields = check_required(required_args, request.url)
            if missing_fields:
                return action_fail({"missing_fields" : missing_fields}, 422,
                        message="required fields are missing")
            else:
                return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route("/", methods = [ 'GET' ])
def home():
    return render_template('base.html')

def c_date(article_name):
    article = mongo.db.articles.find_one({'article' : article_name})

    if article:
        created_date = article['created_date']
    else:
        created_date = get_creation_date(article_name)
        if not created_date:
            return action_success(None, success=False)
        mongo.db.articles.insert({'article' : article_name, 'created_date' : created_date})
    return created_date

@app.route("/page/<string:article_name>", methods = [ 'GET' ])
def get_page(article_name):
    return render_template('base.html',
            article=article_name,
            created_date=timestamp(c_date(article_name)))

@app.route("/<string:article_name>", methods = [ 'GET' ])
@app.route("/lookup/<string:article_name>", methods = [ 'GET' ])
def get_created_date(article_name):
    print article_name
    return action_success(timestamp(c_date(article_name)))
