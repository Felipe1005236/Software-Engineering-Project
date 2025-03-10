// Toggle between Login and Registration forms
document.getElementById('showRegister').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.login-container').classList.add('hidden');
    document.querySelector('.register-container').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.register-container').classList.add('hidden');
    document.querySelector('.login-container').classList.remove('hidden');
});

// Form submission handling
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log('Login:', { email, password });
    alert('Login successful!');
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const repeatPassword = document.getElementById('registerRepeatPassword').value;
    const role = document.getElementById('registerRole').value;

    // Validate password match
    if (password !== repeatPassword) {
        alert('Passwords do not match!');
        return;
    }

    console.log('Register:', { name, email, password, role });
    alert('Registration successful!');
});