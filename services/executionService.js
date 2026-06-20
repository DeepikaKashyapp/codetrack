const vm = require('vm');

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
}

module.exports = new ExecutionService();
