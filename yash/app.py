from flask import Flask, render_template, request, jsonify
import datetime

app = Flask(__name__)

# Store accident reports in memory (in a real app, you'd use a database)
accident_reports = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/report_accident', methods=['POST'])
def report_accident():
    data = request.json
    
    # Create accident report
    report = {
        'id': len(accident_reports) + 1,
        'location': data.get('location', 'Unknown'),
        'description': data.get('description', 'No description provided'),
        'severity': data.get('severity', 'Medium'),
        'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'status': 'Pending'
    }
    
    # Add to reports
    accident_reports.append(report)
    
    # In a real system, you might send notifications to emergency services here
    
    return jsonify({'success': True, 'report_id': report['id']})

@app.route('/reports', methods=['GET'])
def get_reports():
    return jsonify(accident_reports)

@app.route('/update_status/<int:report_id>', methods=['POST'])
def update_status(report_id):
    data = request.json
    
    for report in accident_reports:
        if report['id'] == report_id:
            report['status'] = data.get('status', report['status'])
            return jsonify({'success': True})
    
    return jsonify({'success': False, 'error': 'Report not found'}), 404

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000, debug=True)