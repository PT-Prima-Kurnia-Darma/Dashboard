// js/auth.js
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (sessionStorage.getItem('authToken') && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return; // Exit if not on login page

    const errorMessage = document.getElementById('errorMessage');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner-border');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // UI feedback
        errorMessage.classList.add('d-none');
        spinner.classList.remove('d-none');
        submitButton.disabled = true;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // API call to login endpoint
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // On success, store token and redirect
            sessionStorage.setItem('authToken', data.token);
            window.location.href = 'dashboard.html';

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('d-none');
        } finally {
            // Restore button state
            spinner.classList.add('d-none');
            submitButton.disabled = false;
        }
    });
});