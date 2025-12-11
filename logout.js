document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
