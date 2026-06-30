from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {
        "application": "Formula Fan",
        "version": "0.0.1-alpha",
        "status": "Running",
        "message": "Welcome to Formula Fan!"
    }

if __name__ == "__main__":
    app.run(debug=True)