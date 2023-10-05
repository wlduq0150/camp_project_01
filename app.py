from flask import Flask, redirect, render_template, url_for
from DB_handler import DBModule

app = Flask(__name__)
DB = DBModule()

@app.route("/")
def profile():
    return render_template("main.html")

if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=8082)  # Run the development server