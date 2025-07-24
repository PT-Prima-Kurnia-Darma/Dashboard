document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner-border');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        errorMessage.classList.add('d-none');
        
        spinner.classList.remove('d-none');
        submitButton.disabled = true;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        setTimeout(() => {
            const DUMMY_EMAIL = 'user@example.com';
            const DUMMY_PASSWORD = 'user';

            if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
                console.log('Login berhasil (dummy mode)');
                
                const fakeToken = 'dummy-auth-token-12345';
                sessionStorage.setItem('authToken', fakeToken);
                
                window.location.href = 'dashboard.html';
            } else {
                console.log('Login gagal: Kredensial salah (dummy mode)');
                errorMessage.textContent = 'Email atau kata sandi salah.';
                errorMessage.classList.remove('d-none');
                
                spinner.classList.add('d-none');
                submitButton.disabled = false;
            }
        }, 1000); 
    });
});