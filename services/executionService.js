const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

class ExecutionService {
  async executeJavaScript(code, testCases = []) {
    return new Promise((resolve) => {
      let outputLogs = [];
      
      const sandbox = {
        console: {
          log: (...args) => {
            outputLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          },
          error: (...args) => {
            outputLogs.push('Error: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          },
          warn: (...args) => {
            outputLogs.push('Warn: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          }
        },
        // Provide standard globals
        Math, parseInt, parseFloat, String, Number, Boolean, 
        Array, Object, Set, Map, Date, Error, RegExp
      };

      const context = vm.createContext(sandbox);

      try {
        // We compile the script
        const script = new vm.Script(code);
        // We run the script to initialize any functions in the sandbox
        script.runInContext(context, { timeout: 2000 });

        // If there are test cases, evaluate them
        let results = [];
        let allPassed = true;

        if (testCases.length > 0) {
          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            try {
              // tc.call could be like "twoSum([2,7,11,15], 9)"
              // Evaluate the function call in the context
              const execResult = vm.runInContext(tc.call, context, { timeout: 1000 });
              
              // Simple equality check
              const passed = JSON.stringify(execResult) === JSON.stringify(tc.expected);
              if (!passed) allPassed = false;

              results.push({
                testCase: tc.call,
                expected: tc.expected,
                actual: execResult,
                passed
              });
            } catch (tcError) {
              allPassed = false;
              results.push({
                testCase: tc.call,
                expected: tc.expected,
                actual: tcError.toString(),
                passed: false,
                error: true
              });
            }
          }
        }

        resolve({ 
          success: true, 
          output: outputLogs.join('\n'), 
          results, 
          allPassed 
        });

      } catch (error) {
        resolve({ 
          success: false, 
          output: outputLogs.join('\n') + (outputLogs.length > 0 ? '\n' : '') + error.toString(),
          results: [],
          allPassed: false
        });
      }
    });
  }

  async executeCpp(code) {
    return new Promise((resolve) => {
      // 1. Generate unique filename
      const fileId = crypto.randomBytes(16).toString('hex');
      const tmpDir = path.join(__dirname, '..', 'tmp');
      const filename = path.join(tmpDir, `${fileId}.cpp`);
      const outFilename = path.join(tmpDir, `${fileId}.exe`); // Windows default for g++
      
      // 2. Ensure tmp directory exists
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      // 3. Write code to file
      fs.writeFileSync(filename, code);

      // 4. Compile
      exec(`g++ "${filename}" -o "${outFilename}"`, (compileErr, stdout, stderr) => {
        if (compileErr) {
          try { fs.unlinkSync(filename); } catch (e) {}
          return resolve({
            success: false,
            output: 'Compilation Error:\n' + stderr,
            results: [],
            allPassed: false
          });
        }

        // 5. Execute
        exec(`"${outFilename}"`, { timeout: 2000 }, (runErr, runStdout, runStderr) => {
          // Cleanup
          try {
            fs.unlinkSync(filename);
            fs.unlinkSync(outFilename);
          } catch (e) {}

          if (runErr) {
            return resolve({
              success: false,
              output: runErr.killed ? 'Execution timed out (2s limit).' : runStderr || runErr.message,
              results: [],
              allPassed: false
            });
          }

          resolve({
            success: true,
            output: runStdout,
            results: [{
              testCase: "Custom C++ Main",
              expected: "Check console output",
              actual: runStdout,
              passed: true
            }],
            allPassed: true
          });
        });
      });
    });
  }
}

module.exports = new ExecutionService();
