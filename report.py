from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
import os

app = Flask(__name__)

DATA_FILE = 'reports.json'

# Helper to read data
def load_reports():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

# Helper to write data
def save_report(entry):
    data = load_reports()
    data.append(entry)
    # Keep only last 25 entries
    data = data[-25:]
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file)

# Route to show report page
@app.route("/report")
def report_page():
    return render_template("report.html")

# Route to submit data
@app.route("/submit_report", methods=["POST"])
def submit_report():
    gender = request.form.get("gender")
    heart_rate = int(request.form.get("heart_rate"))
    blood_sugar = int(request.form.get("blood_sugar"))
    blood_pressure = request.form.get("blood_pressure")
    haemoglobin = float(request.form.get("haemoglobin"))

    entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "gender": gender,
        "heart_rate": heart_rate,
        "blood_sugar": blood_sugar,
        "blood_pressure": blood_pressure,
        "haemoglobin": haemoglobin
    }

    save_report(entry)
    return "Report submitted successfully! <a href='/report'>Go back</a>"

# Route to get last 25 entries as JSON
@app.route("/get_reports")
def get_reports():
    reports = load_reports()

    if not reports:
        return jsonify({"entries": [], "averages": {}, "advice": "No data."})

    total_hr = sum(r['heart_rate'] for r in reports)
    total_sugar = sum(r['blood_sugar'] for r in reports)
    total_haemo = sum(r['haemoglobin'] for r in reports)
    total_sysbp = sum(int(r['blood_pressure'].split('/')[0]) for r in reports)
    count = len(reports)

    avg_hr = round(total_hr / count, 1)
    avg_sugar = round(total_sugar / count, 1)
    avg_haemo = round(total_haemo / count, 1)
    avg_bp = round(total_sysbp / count, 1)

    gender = reports[-1].get("gender", "Unknown")

    # Ideal ranges
    ideal = {
        "heart_rate": (60, 100),
        "blood_sugar": (70, 140),
        "blood_pressure": (90, 120),
        "haemoglobin": (13.5, 17.5) if gender == "boy" else (12.0, 15.5)
    }

    advice = []
    def check_range(value, key):
        low, high = ideal[key]
        if value < low:
            return f"Low {key.replace('_', ' ')}. Try to increase it."
        elif value > high:
            return f"High {key.replace('_', ' ')}. Consider reducing it."
        return f"{key.replace('_', ' ').title()} is in normal range."

    advice.append(check_range(avg_hr, "heart_rate"))
    advice.append(check_range(avg_sugar, "blood_sugar"))
    advice.append(check_range(avg_bp, "blood_pressure"))
    advice.append(check_range(avg_haemo, "haemoglobin"))

    return jsonify({
        "entries": reports,
        "averages": {
            "heart_rate": avg_hr,
            "blood_sugar": avg_sugar,
            "blood_pressure": avg_bp,
            "haemoglobin": avg_haemo
        },
        "advice": advice
    })

if __name__ == "__main__":
    app.run(debug=True)
