from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import random

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb+srv://fatbeak:Shaun19682@motivationdb.vyiigwa.mongodb.net/?retryWrites=true&w=majority&appName=MotivationDB")
db = client["Mental_Health"]

# Collections
quotes_collection = db["quotes"]
blogs_collection = db["blogs"]
articles_collection = db["articles"]

# Home page with options
@app.route("/motivation")
def motivation_home():
    return render_template("Moti_home.html")

# Quotes page
@app.route("/quotes")
def quotes_page():
    return render_template("quotes.html")

# Blogs page
@app.route("/blogs")
def blogs_page():
    return render_template("blogs.html")

# Articles page
@app.route("/articles")
def articles_page():
    return render_template("articles.html")

# API: Get random quote
@app.route("/get_quote")
def get_quote():
    quotes = list(quotes_collection.find({}, {"_id": 1, "text": 1, "likes": 1}))
    if not quotes:
        return jsonify({"text": "No quotes found.", "likes": 0})
    quote = random.choice(quotes)
    return jsonify({
        "id": str(quote["_id"]),
        "text": quote["text"],
        "likes": quote.get("likes", 0)
    })

# API: Like a quote
@app.route("/like_quote", methods=["POST"])
def like_quote():
    data = request.json
    quote_id = data.get("id")
    if not quote_id:
        return jsonify({"message": "No quote ID provided"}), 400

    result = quotes_collection.update_one(
        {"_id": ObjectId(quote_id)},
        {"$inc": {"likes": 1}}
    )

    if result.modified_count:
        return jsonify({"message": "Quote liked!"})
    return jsonify({"message": "Quote not found or already liked."})

# API: Get a blog
@app.route("/get_blog")
def get_blog():
    blogs = list(blogs_collection.find({}, {"_id": 1, "title": 1, "content": 1, "likes": 1}))
    if not blogs:
        return jsonify({"title": "No blogs found.", "content": "Please check back later."})
    blog = random.choice(blogs)
    return jsonify({
        "id": str(blog["_id"]),
        "title": blog["title"],
        "content": blog["content"],
        "likes": blog.get("likes", 0)
    })

# API: Like a blog
@app.route("/like_blog", methods=["POST"])
def like_blog():
    data = request.json
    blog_id = data.get("id")
    if not blog_id:
        return jsonify({"message": "No blog ID provided"}), 400

    result = blogs_collection.update_one(
        {"_id": ObjectId(blog_id)},
        {"$inc": {"likes": 1}}
    )

    if result.modified_count:
        return jsonify({"message": "Blog liked!"})
    return jsonify({"message": "Blog not found or already liked."})

# API: Get an article
@app.route("/get_article")
def get_article():
    articles = list(articles_collection.find({}, {"_id": 1, "title": 1, "content": 1, "likes": 1}))
    if not articles:
        return jsonify({"title": "No articles found.", "content": "Please check back later."})
    article = random.choice(articles)
    return jsonify({
        "id": str(article["_id"]),
        "title": article["title"],
        "content": article["content"],
        "likes": article.get("likes", 0)
    })

# API: Like an article
@app.route("/like_article", methods=["POST"])
def like_article():
    data = request.json
    article_id = data.get("id")
    if not article_id:
        return jsonify({"message": "No article ID provided"}), 400

    result = articles_collection.update_one(
        {"_id": ObjectId(article_id)},
        {"$inc": {"likes": 1}}
    )

    if result.modified_count:
        return jsonify({"message": "Article liked!"})
    return jsonify({"message": "Article not found or already liked."})

if __name__ == "__main__":
    app.run(debug=True)
