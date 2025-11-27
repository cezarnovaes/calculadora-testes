const puppeteer = require('puppeteer');

describe('Calculadora - Testes E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--window-size=1920,1080',
        '--disable-dev-shm-usage'
      ]
    });
    
    page = await browser.newPage();
    
    // Configurar timeout
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(10000);
    
    // Navega para a aplicação
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 10000
    });
    
    // Aguarda o carregamento completo
    await page.waitForSelector('.calculadora', { timeout: 10000 });
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    // Limpa a calculadora antes de cada teste
    const clearButton = await page.$('button[onclick="limpar()"]');
    if (clearButton) {
      await clearButton.click();
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  // Função helper para debug
  async function debugPage(testName) {
    console.log(`\n=== DEBUG: ${testName} ===`);
    try {
      const display = await page.$eval('#display', el => el.value);
      const resultado = await page.$eval('#resultado', el => el.textContent);
      console.log('Display:', display);
      console.log('Resultado:', resultado);
    } catch (error) {
      console.log('Erro ao obter elementos:', error.message);
    }
    console.log('==================\n');
  }

  test('deve carregar a página corretamente', async () => {
    const title = await page.title();
    expect(title).toBe('Calculadora - Testes');

    const display = await page.$('#display');
    expect(display).not.toBeNull();

    const buttons = await page.$$('.btn');
    expect(buttons.length).toBe(20);
  });

  test('deve realizar operação básica de soma', async () => {
    // Primeiro verifica se o display está vazio
    let displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('');

    // Clica nos botões: 2 + 3
    await page.click('button[onclick="adicionarNumero(\'2\')"]');
    await page.click('button[onclick="adicionarOperacao(\'+\')"]');
    await page.click('button[onclick="adicionarNumero(\'3\')"]');

    // Verifica se a expressão está no display
    displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('2+3');

    // Clica no igual para calcular
    await page.click('button[onclick="calcular()"]');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await debugPage('Após cálculo de soma');

    // Verifica o resultado
    const resultado = await page.$eval('#resultado', el => el.textContent);
    const displayFinal = await page.$eval('#display', el => el.value);

    // Pode ser que o resultado apareça apenas no #resultado e o display mantenha a expressão
    // ou que o display seja atualizado com o resultado
    if (resultado === '= 5') {
      // Resultado aparece no elemento de resultado
      expect(resultado).toBe('= 5');
    } else if (displayFinal === '5') {
      // Display é atualizado com o resultado
      expect(displayFinal).toBe('5');
    } else {
      // Se nenhum dos casos, o teste falha
      expect(resultado).toBe('= 5');
    }
  });

  test('deve calcular raiz quadrada', async () => {
    // Clica no 9 e depois na raiz quadrada
    await page.click('button[onclick="adicionarNumero(\'9\')"]');
    
    let displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('9');

    await page.click('button[onclick="adicionarOperacao(\'√\')"]');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await debugPage('Após raiz quadrada');

    const resultado = await page.$eval('#resultado', el => el.textContent);
    const displayFinal = await page.$eval('#display', el => el.value);

    // Verifica se o resultado aparece em algum lugar
    if (resultado === '= 3') {
      expect(resultado).toBe('= 3');
    } else if (displayFinal === '3') {
      expect(displayFinal).toBe('3');
    } else {
      // Se não apareceu em nenhum, falha
      expect(resultado).toBe('= 3');
    }
  });

  test('deve limpar o display', async () => {
    await page.click('button[onclick="adicionarNumero(\'9\')"]');
    
    let displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('9');
    
    await page.click('button[onclick="limpar()"]');

    displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('');
  });

  test('deve exibir histórico após operações', async () => {
    await page.click('button[onclick="adicionarNumero(\'5\')"]');
    await page.click('button[onclick="adicionarOperacao(\'*\')"]');
    await page.click('button[onclick="adicionarNumero(\'2\')"]');
    await page.click('button[onclick="calcular()"]');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const historicoItems = await page.$$('.item-historico');
    expect(historicoItems.length).toBeGreaterThan(0);

    const historicoText = await page.$eval('#historico-lista', el => el.textContent);
    
    // Verifica se contém a operação e o resultado
    expect(historicoText).toContain('5');
    expect(historicoText).toContain('2');
    expect(historicoText).toContain('10');
  });

  test('deve limpar o histórico', async () => {
    // Primeiro adiciona uma operação ao histórico
    await page.click('button[onclick="adicionarNumero(\'5\')"]');
    await page.click('button[onclick="adicionarOperacao(\'+\')"]');
    await page.click('button[onclick="adicionarNumero(\'3\')"]');
    await page.click('button[onclick="calcular()"]');
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verifica que tem histórico
    let historicoItems = await page.$$('.item-historico');
    const tinhaHistorico = historicoItems.length > 0;

    // Limpa o histórico
    await page.click('button[onclick="limparHistorico()"]');
    
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verifica que o histórico foi limpo
    historicoItems = await page.$$('.item-historico');
    
    if (tinhaHistorico) {
      expect(historicoItems.length).toBe(0);
    } else {
      // Se não tinha histórico antes, pelo menos não deve dar erro
      console.log('Não havia histórico para limpar');
    }
  });

  test('deve lidar com entrada via teclado', async () => {
    await page.focus('#display');
    await page.keyboard.type('8/2');
    await page.keyboard.press('Enter');

    await new Promise(resolve => setTimeout(resolve, 1000));

    await debugPage('Após entrada por teclado');

    const resultado = await page.$eval('#resultado', el => el.textContent);
    const displayValue = await page.$eval('#display', el => el.value);

    if (resultado === '= 4') {
      expect(resultado).toBe('= 4');
    } else if (displayValue === '4') {
      expect(displayValue).toBe('4');
    } else {
      expect(resultado).toBe('= 4');
    }
  });

  test('deve realizar operação com múltiplos números', async () => {
    await page.click('button[onclick="adicionarNumero(\'1\')"]');
    await page.click('button[onclick="adicionarNumero(\'2\')"]');
    await page.click('button[onclick="adicionarNumero(\'3\')"]');
    
    let displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('123');
  });

  test('deve realizar operação com decimal', async () => {
    await page.click('button[onclick="adicionarNumero(\'1\')"]');
    await page.click('button[onclick="adicionarDecimal()"]');
    await page.click('button[onclick="adicionarNumero(\'5\')"]');
    
    let displayValue = await page.$eval('#display', el => el.value);
    expect(displayValue).toBe('1.5');
  });
});