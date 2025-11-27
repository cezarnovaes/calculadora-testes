const Calculadora = require('../../src/calculadora');

describe('Calculadora - Testes Unitários', () => {
    beforeEach(() => {
        Calculadora.limparHistorico();
    });

    describe('Operações Básicas', () => {
        test('somar dois números positivos', () => {
            expect(Calculadora.somar(2, 3)).toBe(5);
        });

        test('somar número positivo com negativo', () => {
            expect(Calculadora.somar(5, -3)).toBe(2);
        });

        test('somar números decimais', () => {
            expect(Calculadora.somar(2.5, 3.1)).toBeCloseTo(5.6);
        });

        test('subtrair dois números', () => {
            expect(Calculadora.subtrair(10, 4)).toBe(6);
        });

        test('subtrair resultando em negativo', () => {
            expect(Calculadora.subtrair(3, 7)).toBe(-4);
        });

        test('multiplicar dois números', () => {
            expect(Calculadora.multiplicar(3, 4)).toBe(12);
        });

        test('multiplicar por zero', () => {
            expect(Calculadora.multiplicar(5, 0)).toBe(0);
        });

        test('dividir dois números', () => {
            expect(Calculadora.dividir(10, 2)).toBe(5);
        });

        test('dividir números decimais', () => {
            expect(Calculadora.dividir(1, 4)).toBe(0.25);
        });
    });

    describe('Validações e Erros', () => {
        test('lançar erro ao dividir por zero', () => {
            expect(() => Calculadora.dividir(10, 0)).toThrow('Divisão por zero não é permitida');
        });

        test('lançar erro com parâmetros inválidos', () => {
            expect(() => Calculadora.somar('a', 2)).toThrow('Valor deve ser um número válido');
            expect(() => Calculadora.somar(2, NaN)).toThrow('Valor deve ser um número válido');
        });

        test('lançar erro com raiz quadrada de negativo', () => {
            expect(() => Calculadora.raizQuadrada(-4)).toThrow('Não é possível calcular raiz quadrada de número negativo');
        });
    });

    describe('Operações Avançadas', () => {
        test('calcular potência', () => {
            expect(Calculadora.potencia(2, 3)).toBe(8);
            expect(Calculadora.potencia(5, 2)).toBe(25);
        });

        test('calcular raiz quadrada', () => {
            expect(Calculadora.raizQuadrada(9)).toBe(3);
            expect(Calculadora.raizQuadrada(16)).toBe(4);
        });

        test('calcular porcentagem', () => {
            expect(Calculadora.porcentagem(200, 10)).toBe(20);
            expect(Calculadora.porcentagem(150, 50)).toBe(75);
        });
    });

    describe('Histórico', () => {
        test('adicionar operação ao histórico', () => {
            Calculadora.somar(2, 3);
            const historico = Calculadora.obterHistorico();
            
            expect(historico).toHaveLength(1);
            expect(historico[0].operacao).toBe('2 + 3');
            expect(historico[0].resultado).toBe(5);
        });

        test('limitar histórico a 10 operações', () => {
            for (let i = 0; i < 15; i++) {
                Calculadora.somar(i, i + 1);
            }
            
            const historico = Calculadora.obterHistorico();
            expect(historico).toHaveLength(10);
        });

        test('limpar histórico', () => {
            Calculadora.somar(1, 2);
            Calculadora.limparHistorico();
            
            expect(Calculadora.obterHistorico()).toHaveLength(0);
        });
    });

    describe('Expressões Matemáticas', () => {
        test('calcular expressão simples', () => {
            expect(Calculadora.calcularExpressao('2 + 3 * 4')).toBe(14);
        });

        test('calcular expressão com parênteses', () => {
            expect(Calculadora.calcularExpressao('(2 + 3) * 4')).toBe(20);
        });

        test('calcular expressão com raiz quadrada', () => {
            expect(Calculadora.calcularExpressao('√9 + 1')).toBe(4);
        });

        test('calcular expressão com potência', () => {
            expect(Calculadora.calcularExpressao('2^3 + 1')).toBe(9);
        });

        test('lançar erro com expressão inválida', () => {
            expect(() => Calculadora.calcularExpressao('2 + ')).toThrow('Expressão matemática inválida');
            expect(() => Calculadora.calcularExpressao('abc')).toThrow('Expressão contém caracteres inválidos');
        });

        test('lançar erro com tipo inválido', () => {
            expect(() => Calculadora.calcularExpressao(123)).toThrow('Expressão deve ser uma string');
        });
    });
});