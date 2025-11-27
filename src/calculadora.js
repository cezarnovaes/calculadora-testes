// Calculadora - Módulo principal com todas as funções
const Calculadora = (function() {
    'use strict';

    const historico = [];
    const MAX_HISTORICO = 10;

    function adicionarHistorico(operacao, resultado) {
        historico.unshift({
            operacao,
            resultado,
            timestamp: new Date().toISOString()
        });
        
        if (historico.length > MAX_HISTORICO) {
            historico.pop();
        }
    }

    function validarNumero(num) {
        if (typeof num !== 'number' || isNaN(num)) {
            throw new Error('Valor deve ser um número válido');
        }
        return true;
    }

    function somar(a, b) {
        validarNumero(a);
        validarNumero(b);
        const resultado = a + b;
        adicionarHistorico(`${a} + ${b}`, resultado);
        return resultado;
    }

    function subtrair(a, b) {
        validarNumero(a);
        validarNumero(b);
        const resultado = a - b;
        adicionarHistorico(`${a} - ${b}`, resultado);
        return resultado;
    }

    function multiplicar(a, b) {
        validarNumero(a);
        validarNumero(b);
        const resultado = a * b;
        adicionarHistorico(`${a} × ${b}`, resultado);
        return resultado;
    }

    function dividir(a, b) {
        validarNumero(a);
        validarNumero(b);
        
        if (b === 0) {
            throw new Error('Divisão por zero não é permitida');
        }
        
        const resultado = a / b;
        adicionarHistorico(`${a} ÷ ${b}`, resultado);
        return resultado;
    }

    function potencia(base, expoente) {
        validarNumero(base);
        validarNumero(expoente);
        const resultado = Math.pow(base, expoente);
        adicionarHistorico(`${base}^${expoente}`, resultado);
        return resultado;
    }

    function raizQuadrada(num) {
        validarNumero(num);
        
        if (num < 0) {
            throw new Error('Não é possível calcular raiz quadrada de número negativo');
        }
        
        const resultado = Math.sqrt(num);
        adicionarHistorico(`√${num}`, resultado);
        return resultado;
    }

    function porcentagem(num, percent) {
        validarNumero(num);
        validarNumero(percent);
        const resultado = (num * percent) / 100;
        adicionarHistorico(`${percent}% de ${num}`, resultado);
        return resultado;
    }

    function obterHistorico() {
        return [...historico];
    }

    function limparHistorico() {
        historico.length = 0;
    }

    function calcularExpressao(expressao) {
        if (typeof expressao !== 'string') {
            throw new Error('Expressão deve ser uma string');
        }

        // Remove espaços e valida caracteres
        const exprLimpa = expressao.replace(/\s+/g, '');
        
        // Permite números, operadores matemáticos, parênteses, ponto decimal, raiz e notação científica
        if (!/^[-+*/×÷√^.0-9eE\s()]+$/.test(exprLimpa)) {
            throw new Error('Expressão contém caracteres inválidos');
        }

        try {
            // Substitui símbolos matemáticos para JavaScript
            const exprPadronizada = exprLimpa
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**')
                .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
                .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');

            // Avalia a expressão de forma segura
            const resultado = Function('"use strict"; return (' + exprPadronizada + ')')();
            
            if (typeof resultado !== 'number' || isNaN(resultado) || !isFinite(resultado)) {
                throw new Error('Resultado inválido');
            }

            adicionarHistorico(expressao, resultado);
            return resultado;
        } catch (error) {
            throw new Error('Expressão matemática inválida: ' + error.message);
        }
    }

    return {
        somar,
        subtrair,
        multiplicar,
        dividir,
        potencia,
        raizQuadrada,
        porcentagem,
        obterHistorico,
        limparHistorico,
        calcularExpressao
    };
})();

// Export para Node.js e navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculadora;
} else {
    window.Calculadora = Calculadora;
}