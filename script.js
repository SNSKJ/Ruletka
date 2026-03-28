// Инициализация переменных
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');
const wordInput = document.getElementById('wordInput');
const addWordBtn = document.getElementById('addWordBtn');
const wordsList = document.getElementById('wordsList');
const clearBtn = document.getElementById('clearBtn');

let words = ['Пицца', 'Суши', 'Бургер', 'Паста', 'Салат'];
let colors = [];
let currentRotation = 0;
let isSpinning = false;

// Генерация цветов для секторов
function generateColors(count) {
    const hues = [];
    for (let i = 0; i < count; i++) {
        hues.push((i * 360 / count) % 360);
    }
    return hues.map(hue => `hsl(${hue}, 70%, 60%)`);
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
        ctx.fillStyle = '#ddd';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#666';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Добавьте слова', centerX, centerY);
        return;
    }
    
    colors = generateColors(words.length);
    const sliceAngle = (2 * Math.PI) / words.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем сектора
    for (let i = 0; i < words.length; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Добавляем текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(words[i], radius - 20, 5);
        ctx.restore();
    }
    
    // Центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Обновление списка слов
function updateWordsList() {
    wordsList.innerHTML = '';
    
    if (words.length === 0) {
        wordsList.innerHTML = '<p style="color: #999; width: 100%;">Список слов пуст</p>';
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
    
    // Случайный угол вращения (минимум 5 полных оборотов)
    const randomSpin = Math.floor(Math.random() * 360) + 1800;
    currentRotation += randomSpin;
    
    canvas.style.transform = `rotate(-${currentRotation}deg)`;
    
    // Ждем окончания анимации
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Вычисляем победителя
        const normalizedRotation = currentRotation % 360;
        const sliceAngle = 360 / words.length;
        const winningIndex = Math.floor(normalizedRotation / sliceAngle);
        
        const winner = words[winningIndex];
        resultDiv.textContent = `🎉 ${winner} 🎉`;
        resultDiv.classList.add('show');
        
        // Эффект конфетти (опционально)
        celebrate();
    }, 4000);
}

// Простой эффект празднования
function celebrate() {
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 50);
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
drawWheel();
updateWordsList();
