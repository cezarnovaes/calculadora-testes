const Calculadora = require('../../src/calculadora');

describe('Calculadora - Testes de Integração - Cobertura Completa', () => {
    beforeEach(() => {
        Calculadora.limparHistorico();
    });

    describe('Cobertura de Branches Específicos', () => {
        test('deve cobrir branch de validação com números muito grandes', () => {
            const numeroGrande = 1.7976931348623157e+308;
            expect(() => Calculadora.somar(numeroGrande, 1)).not.toThrow();
        });

        test('deve cobrir branch de expressões com raiz quadrada complexa', () => {
            const resultado = Calculadora.calcularExpressao('√(9) + 1');
            expect(resultado).toBe(4);
        });

        test('deve cobrir branch de erro em expressão com resultado NaN', () => {
            expect(() => {
                Calculadora.calcularExpressao('0/0');
            }).toThrow('Resultado inválido');
        });

        test('deve cobrir branch de erro em expressão com caracteres inválidos', () => {
            expect(() => {
                Calculadora.calcularExpressao('2 + abc');
            }).toThrow('Expressão contém caracteres inválidos');
        });

        test('deve cobrir branch de erro em expressão com tipo inválido', () => {
            expect(() => {
                Calculadora.calcularExpressao(123);
            }).toThrow('Expressão deve ser uma string');
        });

        test('deve cobrir branch de expressão vazia', () => {
            expect(() => {
                Calculadora.calcularExpressao('');
            }).toThrow('Expressão contém caracteres inválidos');
        });

        test('deve cobrir branch de expressão com apenas espaços', () => {
            expect(() => {
                Calculadora.calcularExpressao('   ');
            }).toThrow('Expressão contém caracteres inválidos');
        });

        test('deve cobrir branch de divisão por zero em expressão', () => {
            expect(() => {
                Calculadora.calcularExpressao('1 / 0');
            }).toThrow('Resultado inválido');
        });
    });

    describe('Testes de Edge Cases para Cobertura', () => {
        test('deve lidar com números negativos em todas as operações', () => {
            expect(Calculadora.somar(-5, -3)).toBe(-8);
            expect(Calculadora.subtrair(-5, -3)).toBe(-2);
            expect(Calculadora.multiplicar(-5, 3)).toBe(-15);
            expect(Calculadora.dividir(-10, 2)).toBe(-5);
            expect(Calculadora.potencia(-2, 3)).toBe(-8);
        });

        test('deve lidar com números decimais extremos', () => {
            expect(Calculadora.somar(0.0000001, 0.0000002)).toBeCloseTo(0.0000003, 10);
            expect(Calculadora.multiplicar(0.1, 0.1)).toBeCloseTo(0.01, 10);
        });

        test('deve validar histórico com operações mistas', () => {
            Calculadora.somar(1, 2);
            expect(() => Calculadora.dividir(5, 0)).toThrow();
            Calculadora.multiplicar(3, 4);

            const historico = Calculadora.obterHistorico();
            expect(historico).toHaveLength(2);
            expect(historico[0].operacao).toBe('3 × 4');
            expect(historico[1].operacao).toBe('1 + 2');
        });

        test('deve testar múltiplas operações de porcentagem', () => {
            const resultados = [];
            resultados.push(Calculadora.porcentagem(100, 10));
            resultados.push(Calculadora.porcentagem(200, 25)); 
            resultados.push(Calculadora.porcentagem(50, 100)); 
            resultados.push(Calculadora.porcentagem(0, 50));

            expect(resultados).toEqual([10, 50, 50, 0]);
        });
    });

    describe('Testes de Expressões Complexas para Cobertura', () => {
        test('deve calcular expressões com múltiplos níveis de parênteses', () => {
            const resultado = Calculadora.calcularExpressao('((2 + 3) * (4 - 1)) / √9');
            expect(resultado).toBe(5);
        });

        test('deve calcular expressões com potência e raiz', () => {
            const resultado = Calculadora.calcularExpressao('2^3 + √16');
            expect(resultado).toBe(12);
        });

        test('deve calcular expressões com números grandes', () => {
            const resultado = Calculadora.calcularExpressao('1000 + 200');
            expect(resultado).toBe(1200);
        });

        test('deve lidar com expressões com múltiplos operadores consecutivos', () => {
            expect(() => {
                Calculadora.calcularExpressao('2++3');
            }).toThrow('Expressão matemática inválida');
        });

        test('deve calcular expressões com raiz quadrada de expressão', () => {
            const resultado = Calculadora.calcularExpressao('√(4 + 5)');
            expect(resultado).toBe(3);
        });
    });

    describe('Testes de Performance e Estresse para Cobertura', () => {
        test('deve lidar com muitas operações sequenciais', () => {
            let resultado = 0;
            for (let i = 0; i < 100; i++) {
                resultado = Calculadora.somar(resultado, 1);
            }
            expect(resultado).toBe(100);
            expect(Calculadora.obterHistorico()).toHaveLength(10);
        });

        test('deve lidar com operações de precisão decimal', () => {
            const resultado = Calculadora.dividir(1, 7);
            expect(resultado).toBeCloseTo(0.142857, 6);
        });
    });

    describe('Testes Específicos para Linhas Não Cobertas', () => {
        test('deve cobrir linha 22 - validação de número em subtrair', () => {
            expect(() => Calculadora.subtrair('invalid', 2)).toThrow('Valor deve ser um número válido');
        });

        test('deve cobrir linha 76 - validação de número em dividir', () => {
            expect(() => Calculadora.dividir('invalid', 2)).toThrow('Valor deve ser um número válido');
            expect(() => Calculadora.dividir(10, 'invalid')).toThrow('Valor deve ser um número válido');
        });

        test('deve cobrir linha 102 - validação de número em porcentagem', () => {
            expect(() => Calculadora.porcentagem('invalid', 10)).toThrow('Valor deve ser um número válido');
            expect(() => Calculadora.porcentagem(100, 'invalid')).toThrow('Valor deve ser um número válido');
        });

        test('deve cobrir linha 126 - regex de validação de caracteres', () => {
            expect(() => Calculadora.calcularExpressao('2 + @')).toThrow('Expressão contém caracteres inválidos');
            expect(() => Calculadora.calcularExpressao('2 + #abc')).toThrow('Expressão contém caracteres inválidos');
        });

        test('deve cobrir linha 132 - substituição de símbolos na expressão', () => {
            expect(Calculadora.calcularExpressao('2 × 3')).toBe(6);
            expect(Calculadora.calcularExpressao('10 ÷ 2')).toBe(5);
            expect(Calculadora.calcularExpressao('2 ^ 3')).toBe(8);
            expect(Calculadora.calcularExpressao('√9')).toBe(3);
        });

        test('deve cobrir linha 154 - erro específico na avaliação da expressão', () => {
            expect(() => Calculadora.calcularExpressao('2 + ')).toThrow('Expressão matemática inválida');
            expect(() => Calculadora.calcularExpressao('(2 + 3')).toThrow('Expressão matemática inválida');
            expect(() => Calculadora.calcularExpressao('2 + * 3')).toThrow('Expressão matemática inválida');
        });
    });

    describe('Testes de Integração Completa com Erros', () => {
        test('deve manter estado consistente após erro', () => {
            const historicoInicial = Calculadora.obterHistorico().length;
            
            Calculadora.somar(1, 2);
            
            expect(() => Calculadora.dividir(10, 0)).toThrow();
            
            Calculadora.multiplicar(3, 4);
            
            const historicoFinal = Calculadora.obterHistorico();
            expect(historicoFinal).toHaveLength(historicoInicial + 2);
            expect(historicoFinal[0].operacao).toBe('3 × 4');
            expect(historicoFinal[1].operacao).toBe('1 + 2');
        });

        test('deve lidar com sequência mista de sucessos e falhas', () => {
            const resultados = [];
            
            resultados.push(Calculadora.somar(1, 2));
            expect(() => Calculadora.raizQuadrada(-1)).toThrow();
            resultados.push(Calculadora.multiplicar(3, 4));
            expect(() => Calculadora.somar('invalid', 2)).toThrow();
            resultados.push(Calculadora.potencia(2, 3));
            
            expect(resultados).toEqual([3, 12, 8]);
            expect(Calculadora.obterHistorico()).toHaveLength(3);
        });
    });

    describe('Testes de Formatação de Expressões', () => {
        test('deve lidar com diferentes formatos de espaçamento', () => {
            expect(Calculadora.calcularExpressao('2+3')).toBe(5);
            expect(Calculadora.calcularExpressao('2 + 3')).toBe(5);
            expect(Calculadora.calcularExpressao('  2  +  3  ')).toBe(5);
            expect(Calculadora.calcularExpressao('2+3*4')).toBe(14);
            expect(Calculadora.calcularExpressao('2 + 3 * 4')).toBe(14);
        });

        test('deve lidar com números decimais em expressões', () => {
            expect(Calculadora.calcularExpressao('2.5 + 3.5')).toBe(6);
            expect(Calculadora.calcularExpressao('0.1 + 0.2')).toBeCloseTo(0.3, 10);
            expect(Calculadora.calcularExpressao('1.5 * 2.0')).toBe(3);
        });
    });
});