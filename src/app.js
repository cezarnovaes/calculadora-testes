// Aplicação frontend da calculadora
let displayValue = '';
let ultimaOperacaoRaiz = false;

function atualizarDisplay() {
    document.getElementById('display').value = displayValue;
    document.getElementById('resultado').textContent = '';
}

function adicionarNumero(numero) {
    if (ultimaOperacaoRaiz) {
        displayValue = '';
        ultimaOperacaoRaiz = false;
    }
    displayValue += numero;
    atualizarDisplay();
}

function adicionarOperacao(operacao) {
    if (operacao === '√') {
        // Para raiz quadrada, calculamos imediatamente se há um número no display
        if (displayValue !== '' && !isNaN(displayValue)) {
            try {
                const numero = parseFloat(displayValue);
                const resultado = Calculadora.raizQuadrada(numero);
                document.getElementById('resultado').textContent = `= ${resultado}`;
                displayValue = resultado.toString();
                ultimaOperacaoRaiz = true;
            } catch (error) {
                document.getElementById('resultado').textContent = `Erro: ${error.message}`;
            }
        } else {
            // Se não há número, permite digitar após o √
            displayValue = '√';
            ultimaOperacaoRaiz = false;
        }
        atualizarDisplay();
        return;
    }

    if (displayValue === '' && (operacao === '+' || operacao === '-')) {
        displayValue += operacao;
    } else if (displayValue !== '' && !isUltimoCaracterOperacao()) {
        displayValue += operacao;
    } else if (isUltimoCaracterOperacao() && operacao !== '-') {
        displayValue = displayValue.slice(0, -1) + operacao;
    }
    ultimaOperacaoRaiz = false;
    atualizarDisplay();
}

function adicionarDecimal() {
    if (ultimaOperacaoRaiz) {
        displayValue = '0.';
        ultimaOperacaoRaiz = false;
    } else if (displayValue === '' || isUltimoCaracterOperacao()) {
        displayValue += '0.';
    } else if (!displayValue.includes('.') || isUltimoNumeroComDecimal()) {
        const ultimoNumero = displayValue.split(/[-+*/]/).pop();
        if (!ultimoNumero.includes('.')) {
            displayValue += '.';
        }
    }
    atualizarDisplay();
}

function isUltimoCaracterOperacao() {
    if (displayValue === '') return false;
    const ultimoCaracter = displayValue.slice(-1);
    return ['+', '-', '*', '/', '^'].includes(ultimoCaracter);
}

function isUltimoNumeroComDecimal() {
    const numeros = displayValue.split(/[-+*/]/);
    return numeros.length > 0 && numeros[numeros.length - 1].includes('.');
}

function limpar() {
    displayValue = '';
    ultimaOperacaoRaiz = false;
    atualizarDisplay();
}

function calcular() {
    try {
        if (displayValue === '') return;
        
        // Se termina com operação, remove
        if (isUltimoCaracterOperacao()) {
            displayValue = displayValue.slice(0, -1);
        }

        const resultado = Calculadora.calcularExpressao(displayValue);
        document.getElementById('resultado').textContent = `= ${resultado}`;
        displayValue = resultado.toString();
        ultimaOperacaoRaiz = false;
        atualizarHistorico();
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro: ${error.message}`;
    }
}

function limparHistorico() {
    Calculadora.limparHistorico();
    atualizarHistorico();
}

function atualizarHistorico() {
    const historicoLista = document.getElementById('historico-lista');
    const historico = Calculadora.obterHistorico();
    
    historicoLista.innerHTML = historico.map(item => 
        `<div class="item-historico">
            <strong>${item.operacao}</strong> = ${item.resultado}
        </div>`
    ).join('');
}

// Event listeners para teclado
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if (/[0-9]/.test(key)) {
            adicionarNumero(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            adicionarOperacao(key);
        } else if (key === '.') {
            adicionarDecimal();
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calcular();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            limpar();
        } else if (key === 'Backspace') {
            displayValue = displayValue.slice(0, -1);
            ultimaOperacaoRaiz = false;
            atualizarDisplay();
        } else if (key === 'r' || key === 'R') {
            // Tecla R para raiz quadrada
            event.preventDefault();
            adicionarOperacao('√');
        }
    });
    
    atualizarHistorico();
});