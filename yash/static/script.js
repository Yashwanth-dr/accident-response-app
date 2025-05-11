document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const emergencyBtn = document.getElementById('emergency-btn');
    const reportForm = document.getElementById('report-form');
    const accidentForm = document.getElementById('accident-form');
    const reportsList = document.getElementById('reports-list');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // Show report form when emergency button is clicked
    emergencyBtn.addEventListener('click', function() {
        reportForm.classList.remove('hidden');
        // Scroll to form
        reportForm.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Handle form submission
    accidentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            severity: document.getElementById('severity').value
        };
        
        // Send report to server
        fetch('/report_accident', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success notification
                showNotification('Emergency reported successfully! Help is on the way.', false);
                
                // Reset form
                accidentForm.reset();
                reportForm.classList.add('hidden');
                
                // Refresh reports list
                fetchReports();
            } else {
                showNotification('Error reporting emergency. Please try again.', true);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error connecting to server. Please try again.', true);
        });
    });
    
    // Fetch and display reports
    function fetchReports() {
        fetch('/reports')
            .then(response => response.json())
            .then(reports => {
                if (reports.length === 0) {
                    reportsList.innerHTML = '<p class="no-reports">No reports available</p>';
                    return;
                }
                
                reportsList.innerHTML = '';
                
                // Sort reports by timestamp (newest first)
                reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                reports.forEach(report => {
                    const reportElement = document.createElement('div');
                    reportElement.className = 'report-item';
                    reportElement.innerHTML = `
                        <div class="report-header">
                            <span class="report-id">Report #${report.id}</span>
                            <span class="report-time">${report.timestamp}</span>
                        </div>
                        <div class="report-location">${report.location}</div>
                        <div class="report-description">${report.description}</div>
                        <div>
                            <span class="report-severity severity-${report.severity}">${report.severity}</span>
                            <span class="report-status status-${report.status.replace(/\s+/g, '')}">${report.status}</span>
                        </div>
                    `;
                    reportsList.appendChild(reportElement);
                });
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
                reportsList.innerHTML = '<p class="no-reports">Error loading reports</p>';
            });
    }
    
    // Show notification
    function showNotification(message, isError) {
        notificationMessage.textContent = message;
        notification.classList.remove('hidden');
        
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }
    
    // Initial fetch of reports
    fetchReports();
    
    // Refresh reports every 30 seconds
    setInterval(fetchReports, 30000);
});