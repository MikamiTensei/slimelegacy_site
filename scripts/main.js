// ============================================================
//  SlimeLegacy — main script
// ============================================================

// ---- 1. Плавное появление элементов при скролле ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// ---- 2. Копирование IP при клике ----
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;

    navigator.clipboard.writeText(ip)
        .then(() => showToast('IP скопирован!'))
        .catch(() => {
            // fallback для старых браузеров
            const range = document.createRange();
            range.selectNode(document.getElementById('server-ip'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            showToast('IP скопирован!');
        });
}


// ---- 3. Всплывающая плашка (toast) ----
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}


// ---- 4. Эффект шапки при скролле ----
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(13, 17, 23, 0.95)';
    } else {
        header.style.background = 'rgba(13, 17, 23, 0.85)';
    }
});