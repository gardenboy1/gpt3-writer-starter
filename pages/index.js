import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';


const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
  
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const onUserChangedText = (event) => {
  setUserInput(event.target.value);
  }
  
  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callGenerateEndpoint();
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }


;

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">

        <div className="header">
          <div className="header-title">
            <h1>Pick a topic, get a joke.</h1>
          </div>
          <div className="header-subtitle">
            <h2>Careful—some of these can be quite...pun-ishing.</h2>
          </div>
        </div>
        
        <button onClick={toggleRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <div className="prompt-container">
          <textarea placeholder="e.g. penguins" className="prompt-box" value={userInput} onChange={onUserChangedText} onKeyDown={onKeyDown}/>
          <div className="prompt-buttons">
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};



export default Home;
