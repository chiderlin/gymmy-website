from flask import Flask, render_template

app = Flask(__name__, static_folder="static", static_url_path="/")


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/products")
def products():
    return render_template("products.html")

@app.route("/booking")
def booking():
    return render_template("booking.html")

@app.route("/class/<id>")
def class_(id):
    return render_template("class.html")

@app.route("/member/<username>")
def member(username):
    return render_template("member.html")

@app.route("/backstage")
def backstage():
    return render_template("backstage.html")




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)