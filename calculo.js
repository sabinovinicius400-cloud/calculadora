let display = document.getElementById('display');
let history = document.getElementById('history');
let currentInput = '0';
let shouldResetDisplay = false;

// Adicionar Número ou Constante
function appendNum(num) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = num === 'π' ? 'Math.PI' : num;
        shouldResetDisplay = false;
    } else {
        currentInput += num === 'π' ? '*Math.PI' : num;
    }
    updateDisplay();
}

// Adicionar Operador (+, -, *, /, ^)
function appendOp(op) {
    if (shouldResetDisplay) shouldResetDisplay = false;
    
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/', '^'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }
    updateDisplay();
}

// Adicionar Funções Científicas
function appendFunc(func) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = func + '(';
        shouldResetDisplay = false;
    } else {
        currentInput += '*' + func + '(';
    }
    updateDisplay();
}

// Limpar Tudo (C)
function clearDisplay() {
    currentInput = '0';
    history.textContent = '';
    shouldResetDisplay = false;
    updateDisplay();
}

// Apagar Último Carater
function deleteLast() {
    if (shouldResetDisplay) {
        clearDisplay();
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Atualizar o Ecrã Visual
function updateDisplay() {
    let formatted = currentInput
        .replace(/Math\.PI/g, 'π')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/sqrt\(/g, '√(');
        
    display.textContent = formatted;
}

// Calcular Resultado
function calculate() {
    try {
        let expression = currentInput;
        history.textContent = display.textContent + ' =';

        expression = expression
            .replace(/\^/g, '**')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(');

        let result = Function(`'use strict'; return (${expression})`)();

        if (typeof result === 'number' && !isNaN(result)) {
            result = Math.round(result * 1e10) / 1e10;
        }

        currentInput = result.toString();
        display.textContent = currentInput;
        shouldResetDisplay = true;

    } catch (error) {
        display.textContent = 'Erro';
        shouldResetDisplay = true;
    }
}

// Suporte para Teclado Físico
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendNum(e.key);
    if (['+', '-', '*', '/'].includes(e.key)) appendOp(e.key);
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '(' || e.key === ')') appendOp(e.key);
});

// --- EFEITO HACKER / MATRIX ---
function createHackerBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    const chars = '0123456789+-*/=√π%<>&8∞';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function draw() {
        // Rastro escuro com tom verde
        ctx.fillStyle = 'rgba(2, 12, 6, 0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Brilho na ponta da chuva e verde matrix nas restantes
            if (Math.random() > 0.90) {
                ctx.fillStyle = '#b3ffcc'; /* Verde muito claro para destaque */
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ff66';
            } else {
                ctx.fillStyle = '#00cc52'; /* Verde Matrix */
                ctx.shadowBlur = 3;
                ctx.shadowColor = '#00cc52';
            }

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(draw, 33);
}

document.addEventListener('DOMContentLoaded', createHackerBackground);