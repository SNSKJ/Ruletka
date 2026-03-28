// Инициализация переменных
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');
const wordInput = document.getElementById('wordInput');
const addWordBtn = document.getElementById('addWordBtn');
const wordsList = document.getElementById('wordsList');
const clearBtn = document.getElementById('clearBtn');
const lightsContainer = document.getElementById('lights');
const particlesContainer = document.getElementById('particles');

let words = ['Пицца', 'Суши', 'Бургер', 'Паста', 'Салат'];
let colors = [];
let currentRotation = 0;
let isSpinning = false;

// Создание фоновых частиц
function createParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Создание лампочек вокруг рулетки
function createLights() {
    const count = 24;
    const radius = 242;
    const centerX = 250;
    const centerY = 250;
    
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius - 6;
        const y = centerY + Math.sin(angle) * radius - 6;
        
        const light = document.createElement('div');
        light.className = 'light-bulb';
        light.style.left = x + 'px';
        light.style.top = y + 'px';
        light.style.animationDelay = (i * 0.1) + 's';
        lightsContainer.appendChild(light);
    }
}

// Генерация цветов для секторов
function generateColors(count) {
    const hues = [];
    for (let i = 0; i < count; i++) {
        hues.push((i * 360 / count) % 360);
    }
    return hues.map(hue => `hsl(${hue}, 80%, 55%)`);
}

// Отрисовка рулетки
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    if (words.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a1a3e';
        ctx.fill();
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 24px Orbitron, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.fillText('Добавьте слова', centerX, centerY);
        ctx.shadowBlur = 0;
        return;
    }
    
    colors = generateColors(words.length);
    const sliceAngle = (2 * Math.PI) / words.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Поворачиваем на -90 градусов, чтобы первый сектор был сверху под указателем
    const offsetAngle = -Math.PI / 2;
    
    // Рисуем сектора с эффектом свечения
    for (let i = 0; i < words.length; i++) {
        const startAngle = i * sliceAngle + offsetAngle;
        const endAngle = (i + 1) * sliceAngle + offsetAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Градиент для каждого сектора
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, colors[i]);
        gradient.addColorStop(1, adjustColor(colors[i], -30));
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Добавляем текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Rajdhani, Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(words[i], radius - 20, 5);
        ctx.restore();
    }
    
    // Центральный круг с градиентом
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    centerGradient.addColorStop(0, '#fff');
    centerGradient.addColorStop(1, '#00f3ff');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Функция для затемнения/осветления цвета
function adjustColor(color, amount) {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const rgb = getComputedStyle(div).color.match(/\d+/g);
    document.body.removeChild(div);
    
    if (rgb) {
        const r = Math.max(0, Math.min(255, parseInt(rgb[0]) + amount));
        const g = Math.max(0, Math.min(255, parseInt(rgb[1]) + amount));
        const b = Math.max(0, Math.min(255, parseInt(rgb[2]) + amount));
        return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
}

// Обновление списка слов
function updateWordsList() {
    wordsList.innerHTML = '';
    
    if (words.length === 0) {
        wordsList.innerHTML = '<p style="color: rgba(255,255,255,0.5); width: 100%;">Список слов пуст</p>';
        return;
    }
    
    words.forEach((word, index) => {
        const tag = document.createElement('div');
        tag.className = 'word-tag';
        tag.innerHTML = `
            ${word}
            <span class="remove" onclick="removeWord(${index})">✕</span>
        `;
        wordsList.appendChild(tag);
    });
}

// Добавление слова
function addWord() {
    const word = wordInput.value.trim();
    
    if (word) {
        words.push(word);
        wordInput.value = '';
        drawWheel();
        updateWordsList();
        
        // Анимация добавления
        wordInput.style.transform = 'scale(1.05)';
        setTimeout(() => {
            wordInput.style.transform = 'scale(1)';
        }, 200);
    }
}

// Удаление слова
function removeWord(index) {
    if (!isSpinning) {
        words.splice(index, 1);
        drawWheel();
        updateWordsList();
    }
}

// Очистка всех слов
function clearAllWords() {
    if (!isSpinning && confirm('Вы уверены, что хотите удалить все слова?')) {
        words = [];
        drawWheel();
        updateWordsList();
    }
}

// Вращение рулетки
function spinWheel() {
    if (isSpinning || words.length === 0) {
        if (words.length === 0) {
            alert('Добавьте хотя бы одно слово!');
        }
        return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = '';
    resultDiv.classList.remove('show');
    
    // Звуковой эффект (опционально)
    playSpinSound();
    
    // Случайный угол вращения (минимум 5 полных оборотов)
    const randomSpin = Math.floor(Math.random() * 360) + 1800;
    currentRotation += randomSpin;
    
    canvas.style.transform = `rotate(-${currentRotation}deg)`;
    
    // Ждем окончания анимации
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Вычисляем победителя (учитываем поворот на -90 градусов)
        const normalizedRotation = currentRotation % 360;
        const sliceAngle = 360 / words.length;
        // Корректируем индекс с учетом начального поворота на 90 градусов
        const winningIndex = Math.floor(((normalizedRotation + 90) % 360) / sliceAngle);
        
        const winner = words[winningIndex];
        resultDiv.textContent = `🎉 ${winner} 🎉`;
        resultDiv.classList.add('show');
        
        // Эффект конфетти
        celebrate();
        
        // Звук победы
        playWinSound();
    }, 4000);
}

// Простой звуковой эффект вращения
function playSpinSound() {
    // Можно добавить реальные звуки позже
}

// Звук победы
function playWinSound() {
    // Можно добавить реальные звуки позже
}

// Эффект конфетти
function celebrate() {
    const colors = ['#00f3ff', '#00ff88', '#ff00ff', '#bd00ff', '#ffd700'];
    
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.boxShadow = `0 0 10px ${confetti.style.backgroundColor}`;
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { 
                    transform: 'translateY(0) rotate(0deg) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(100vh) rotate(${Math.random() * 720}deg) scale(0.5)`, 
                    opacity: 0 
                }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// Обработчики событий
spinBtn.addEventListener('click', spinWheel);
addWordBtn.addEventListener('click', addWord);
clearBtn.addEventListener('click', clearAllWords);

wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addWord();
    }
});

// Делаем функции доступными глобально
window.removeWord = removeWord;

// Инициализация
createParticles();
createLights();
drawWheel();
updateWordsList();
