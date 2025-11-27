module.exports = async function() {
  if (global.__SERVER__) {
    console.log('Encerrando servidor...');
    global.__SERVER__.kill('SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};