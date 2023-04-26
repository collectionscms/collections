const Output = {
  info: (...output: any[]) => console.log(`✨ `, ...output),
  success: (...output: any[]) => console.log(`⭐️ `, ...output),
  error: (...output: any[]) => console.log(`❌ `, ...output),
};

export default Output;
