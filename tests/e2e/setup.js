const { spawn } = require('child_process');
const path = require('path');

module.exports = async function() {
  console.log('Iniciando servidor para testes E2E...');
  
  const srcPath = path.join(__dirname, '../../src');
  
  global.__SERVER__ = spawn('npx', ['http-server', srcPath, '-p', '3000', '-s'], {
    stdio: 'inherit',
    shell: true
  });

  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Servidor iniciado na porta 3000');
};