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
// ============================================================
//  Магазин: переключение серверов
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.server-tab');
    const cards = document.querySelectorAll('.donate-card[data-server]');
    const subtitle = document.getElementById('donate-subtitle');
    const toast = document.getElementById('toast');

    // Если мы не на странице магазина — выходим
    if (!tabs.length || !cards.length) return;

    const SERVER_NAMES = {
        survival: 'Survival',
        tech:     'Tech',
        magic:    'Magic',
        skyblock: 'SkyBlock',
    };

    function selectServer(serverKey) {
        // 1. Переключаем активный таб
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.server === serverKey);
        });

        // 2. Показываем карточки нужного сервера, скрываем остальные
        cards.forEach(card => {
            if (card.dataset.server === serverKey) {
                card.hidden = false;
                // Перезапускаем анимацию появления
                card.classList.remove('visible');
                void card.offsetWidth;
                card.classList.add('visible');
            } else {
                card.hidden = true;
            }
        });

        // 3. Обновляем подзаголовок
        if (subtitle) {
            subtitle.textContent = `Привилегии для сервера ${SERVER_NAMES[serverKey] || serverKey}`;
        }

        // 4. Показываем тост
        if (toast) {
            toast.textContent = `Сервер: ${SERVER_NAMES[serverKey] || serverKey}`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1600);
        }
    }

    // Вешаем обработчики
    tabs.forEach(tab => {
        tab.addEventListener('click', () => selectServer(tab.dataset.server));
    });

    // По умолчанию — survival
    selectServer('survival');
});
// ============================================================
//  Личный кабинет
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.lk-tab');
    const panels = document.querySelectorAll('.lk-panel');

    // Если мы не на странице ЛК — выходим
    if (!tabs.length || !panels.length) return;

    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1800);
    }

    // ---- Переключение табов ----
    function selectTab(key) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));

        // Запускаем fade-in для видимых элементов внутри панели
        document
            .querySelectorAll(`.lk-panel[data-panel="${key}"] .fade-in`)
            .forEach(el => {
                el.classList.remove('visible');
                void el.offsetWidth;
                el.classList.add('visible');
            });
    }

    tabs.forEach(t => t.addEventListener('click', () => selectTab(t.dataset.tab)));

    // ---- Выход ----
    const logoutBtn = document.getElementById('lk-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Выйти из аккаунта?')) {
                showToast('Ты вышел из аккаунта');
                // В реальном проекте здесь редирект на страницу входа
            }
        });
    }

    // ---- Обновить ----
    const refreshBtn = document.getElementById('lk-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '🔄 Обновление...';
            setTimeout(() => {
                refreshBtn.disabled = false;
                refreshBtn.textContent = '🔄 Обновить';
                showToast('Данные обновлены');
            }, 800);
        });
    }

    // ---- Сохранить настройки ----
    const saveBtn = document.getElementById('set-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const nick = document.getElementById('set-nick').value.trim() || 'Steve';
            const email = document.getElementById('set-email').value.trim();
            const discord = document.getElementById('set-discord').value.trim();

            document.getElementById('lk-nickname').textContent = nick;
            document.getElementById('lk-avatar').textContent = nick[0].toUpperCase();

            console.log('Сохранённые данные:', { nick, email, discord });
            showToast('Изменения сохранены');
        });
    }

    // ---- Кнопки опасной зоны ----
    const resetStats = document.getElementById('reset-stats');
    if (resetStats) {
        resetStats.addEventListener('click', () => {
            if (confirm('Точно сбросить всю статистику? Это необратимо.')) {
                ['stat-hours', 'stat-kills', 'stat-deaths'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '0';
                });
                showToast('Статистика сброшена');
            }
        });
    }

    const changePass = document.getElementById('change-pass');
    if (changePass) {
        changePass.addEventListener('click', () => showToast('Ссылка для смены пароля отправлена на email'));
    }

    const deleteAccount = document.getElementById('delete-account');
    if (deleteAccount) {
        deleteAccount.addEventListener('click', () => {
            if (confirm('Удалить аккаунт навсегда? Все покупки будут потеряны.')) {
                showToast('Аккаунт удалён (демо)');
            }
        });
    }

    // ---- Аватар: показываем первую букву ника ----
    const nickEl = document.getElementById('lk-nickname');
    const avatarEl = document.getElementById('lk-avatar');
    if (nickEl && avatarEl) {
        avatarEl.textContent = nickEl.textContent.trim()[0].toUpperCase();
    }
});