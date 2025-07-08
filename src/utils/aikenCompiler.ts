
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
// Path to the Aiken project
const AIKEN_PROJECT_PATH = path.join(__dirname, '../smart-contracts');
// Compile Aiken smart contracts
export const compileAikenContracts = () => {
  try {
    // Check if Aiken is installed
    try {
      execSync('aiken --version', {
        stdio: 'ignore'
      });
    } catch (error) {
      console.error('Aiken is not installed. Please install it first: https://aiken-lang.org/installation-guide');
      return null;
    }
    // Initialize Aiken project if needed
    if (!fs.existsSync(path.join(AIKEN_PROJECT_PATH, 'aiken.toml'))) {
      console.log('Initializing Aiken project...');
      execSync('aiken init', {
        cwd: AIKEN_PROJECT_PATH
      });
    }
    // Compile the contracts
    console.log('Compiling Aiken smart contracts...');
    execSync('aiken build', {
      cwd: AIKEN_PROJECT_PATH
    });
\
    const plutusJsonPath = path.join(AIKEN_PROJECT_PATH, 'plutus.json');
    if (fs.existsSync(plutusJsonPath)) {
      const plutusJson = JSON.parse(fs.readFileSync(plutusJsonPath, 'utf8'));
      return plutusJson;
    } else {
      console.error('Compilation succeeded but plutus.json not found');
      return null;
    }
  } catch (error) {
    console.error('Error compiling Aiken contracts:', error);
    return null;
  }
};
// Get compiled validator for a specific contract
export const getCompiledValidator = (validatorName: string) => {
  const compiledContracts = compileAikenContracts();
  if (!compiledContracts) return null;
  
  const validator = compiledContracts.validators.find((v: any) => v.title === validatorName);
  return validator || null;
};

export const deployValidator = async (validatorName: string) => {
  const validator = getCompiledValidator(validatorName);
  if (!validator) {
    throw new Error(`Validator ${validatorName} not found or compilation failed`);
  }

  return {
    validatorHash: validator.hash,
    compiledCode: validator.compiledCode,
    address: `addr_test1${validator.hash.substring(0, 40)}`
  };
};
export default {
  compileAikenContracts,
  getCompiledValidator,
  deployValidator
};