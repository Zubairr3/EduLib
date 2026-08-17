function toggleForms() {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    if (loginBox.style.display === 'none') {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
    } else {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            showToast("🚀 Login successful! Redirecting securely...");
            
            setTimeout(() => {
                // THE ULTIMATE OVERRIDE: If the DB says admin, OR if your name is MdZubair, go to Admin!
                if (data.isAdmin === true || data.isAdmin === "true" || username === "MdZubair") {
                    window.location.href = '/admin.html';
                } else {
                    window.location.href = '/dashboard.html';
                }
            }, 1200);
        } else {
            showToast("❌ " + (data.message || "Invalid credentials"));
        }
    } catch (err) {
        showToast("⚠️ Network error");
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            showToast("✅ Registration successful! Please sign in.");
            document.getElementById('registerForm').reset();
            toggleForms();
        } else {
            showToast("❌ " + (data.error || "Registration failed"));
        }
    } catch (err) {
        showToast("⚠️ Network error");
    }
});