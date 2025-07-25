// js/dashboard.js
import { API_BASE_URL } from './config.js';

// --- Authentication & Guards ---
const token = sessionStorage.getItem('authToken');
if (!token) {
    alert('You must be logged in to view this page.');
    window.location.href = 'index.html';
}

// --- DOM Elements ---
const reportsTableBody = document.getElementById('reports-tbody');
const statusContainer = document.getElementById('status-container');
const logoutButton = document.getElementById('logoutButton');

// --- Functions ---

/**
 * Shows a status message (loading/error/empty).
 * @param {string} message 
 */
function showStatus(message) {
    reportsTableBody.innerHTML = '';
    statusContainer.innerHTML = `<p class="text-muted">${message}</p>`;
    statusContainer.classList.remove('d-none');
}

/**
 * Fetches and renders the list of reports.
 */
async function loadReports() {
    showStatus('Loading reports...');
    try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch reports.');
        
        const reports = await response.json();

        if (reports.length === 0) {
            showStatus('No reports found.');
            return;
        }

        // Render table rows
        statusContainer.classList.add('d-none');
        reportsTableBody.innerHTML = reports.map(report => `
            <tr>
                <td class="ps-4">${report.name}</td>
                <td>${new Date(report.createdAt).toLocaleDateString('id-ID')}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-primary download-btn" data-filename="${report.fileName}">
                        Download
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        showStatus(`Error: ${error.message}`);
    }
}

/**
 * Handles the download process for a specific file.
 * @param {HTMLButtonElement} button 
 * @param {string} fileName 
 */
async function handleDownload(button, fileName) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;

    try {
        const response = await fetch(`${API_BASE_URL}/reports/${fileName}/download-url`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Could not get download link.');
        
        const data = await response.json();
        
        // Open the secure, temporary URL from GCP to start the download.
        window.open(data.url, '_blank');

    } catch (error) {
        alert(`Download failed: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// --- Event Listeners ---

// Load reports when the page is ready.
document.addEventListener('DOMContentLoaded', loadReports);

// Handle logout.
logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('authToken');
    window.location.href = 'index.html';
});

// Use event delegation for download buttons.
reportsTableBody.addEventListener('click', (event) => {
    const button = event.target.closest('.download-btn');
    if (button) {
        handleDownload(button, button.dataset.filename);
    }
});