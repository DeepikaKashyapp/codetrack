import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, XCircle, ArrowLeft, Loader2, Maximize2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Editor from '@monaco-editor/react';
import './Workspace.css';

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const CPP_TEMPLATE = `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    // Write your C++ code here to test your logic
    // Print the output to the console
    
    cout << "Hello C++!" << endl;
    
    return 0;
}`;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + `/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProblem(data.data);
          setCode(data.data.default_code || '// Write your JavaScript code here\n');
        } else {
          alert('Problem not found');
          navigate('/problems');
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchProblem();
  }, [id, token, navigate]);

  const handleRun = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setTestResults(null);
    setOutput('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/submissions/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code, problemId: id, language })
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.data.output || 'Code executed successfully. No console output.');
        setTestResults(data.data.results);
      } else {
        setOutput(data.error || 'Failed to run code');
      }
    } catch (err) {
      setOutput('Error connecting to the execution server.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    setTestResults(null);
    setOutput('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/submissions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code, problemId: id, language })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.data.success && data.data.allPassed) {
          setOutput('🎉 ACCEPTED!\n\nAll test cases passed successfully. Your progress has been saved.');
        } else {
          setOutput('❌ WRONG ANSWER or ERROR.\n\nCheck the test case results below.');
        }
        setTestResults(data.data.results);
      } else {
        setOutput(data.error || 'Failed to submit code');
      }
    } catch (err) {
      setOutput('Error connecting to the execution server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return <div className="workspace-loading"><Loader2 className="spin" size={32} /></div>;
  }

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <button className="back-btn" onClick={() => navigate('/problems')}><ArrowLeft size={16} /> Back</button>
        <div className="workspace-actions">
          <button className="btn run-btn" onClick={handleRun} disabled={isRunning || isSubmitting}>
            {isRunning ? <Loader2 className="spin" size={14}/> : <Play size={14} />} Run
          </button>
          <button className="btn submit-btn" onClick={handleSubmit} disabled={isRunning || isSubmitting}>
            {isSubmitting ? <Loader2 className="spin" size={14}/> : <CheckCircle2 size={14} />} Submit
          </button>
        </div>
      </div>

      <div className="workspace-body">
        {/* Left Pane: Problem Description */}
        <div className="problem-pane glass-panel">
          <h2 className="problem-title">{problem.id}. {problem.title}</h2>
          <div className="problem-meta">
            <span className={`diff-badge ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          </div>
          <div className="problem-description" dangerouslySetInnerHTML={{ __html: problem.description || 'No description provided.' }} />
        </div>

        {/* Right Pane: Code Editor + Terminal */}
        <div className="editor-pane glass-panel">
          <div className="editor-header">
            <select 
              className="lang-selector font-mono" 
              value={language} 
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                if (newLang === 'cpp') {
                  setCode(CPP_TEMPLATE);
                } else {
                  setCode(problem?.default_code || '// Write your JavaScript code here\\n');
                }
              }}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
            <Maximize2 size={14} color="var(--text-secondary)" style={{cursor: 'pointer'}} />
          </div>
          <div className="editor-container">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : 'javascript'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
              }}
            />
          </div>
          
          {/* Terminal / Output Console */}
          <div className="terminal-container">
            <div className="terminal-header font-mono">Console Output</div>
            <div className="terminal-body font-mono">
              <pre>{output}</pre>
              
              {testResults && testResults.length > 0 && (
                <div className="test-cases-results">
                  <h4 style={{marginTop: '15px', marginBottom: '10px', color: '#fff'}}>Test Cases:</h4>
                  {testResults.map((tc, idx) => (
                    <div key={idx} className={`tc-result ${tc.passed ? 'passed' : 'failed'}`}>
                      <div className="tc-header">
                        {tc.passed ? <CheckCircle2 size={14} color="var(--success)" /> : <XCircle size={14} color="var(--error)" />}
                        <span>{tc.passed ? 'Accepted' : 'Failed'}</span>
                      </div>
                      <div className="tc-details">
                        <div><strong>Input:</strong> {tc.testCase}</div>
                        <div><strong>Expected:</strong> {JSON.stringify(tc.expected)}</div>
                        <div style={{ color: tc.passed ? 'var(--text-primary)' : 'var(--error)' }}>
                          <strong>Output:</strong> {tc.error ? tc.actual : JSON.stringify(tc.actual)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
