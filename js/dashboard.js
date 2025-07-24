document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('userName');
    const downloadButton = document.getElementById('downloadButton');
    const logoutButton = document.getElementById('logoutButton');
    const downloadMessage = document.getElementById('downloadMessage');
    const spinner = downloadButton.querySelector('.spinner-border');

    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('loggedInUser'); // Ambil nama pengguna

    if (!token || !user) {
        alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
        window.location.href = 'index.html';
        return;
    }

    // Tampilkan nama pengguna di elemen span
    userNameSpan.textContent = user;

    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('loggedInUser'); // Hapus juga nama pengguna
        window.location.href = 'index.html';
    });

    downloadButton.addEventListener('click', async () => {
        spinner.classList.remove('d-none');
        downloadButton.disabled = true;
        downloadMessage.classList.add('d-none');

        const downloadEndpoint = 'https://your-gcp-backend.com/api/download';

        try {
            const response = await fetch(downloadEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const disposition = response.headers.get('content-disposition');
                let filename = 'downloaded-file';
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                a.remove();

                downloadMessage.textContent = 'Unduhan berhasil dimulai!';
                downloadMessage.className = 'alert alert-success mt-3';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengunduh file.');
            }
        } catch (error) {
            console.error('Error saat mengunduh:', error);
            downloadMessage.textContent = `Gagal mengunduh: File tidak ditemukan atau masalah server.`;
            downloadMessage.className = 'alert alert-danger mt-3';
        } finally {
            spinner.classList.add('d-none');
            downloadButton.disabled = false;
            downloadMessage.classList.remove('d-none');
        }
    });
});