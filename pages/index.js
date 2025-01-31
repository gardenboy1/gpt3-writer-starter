import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';


const Home = () => {
  let recognition;
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [synth, setSynth] = useState(null);


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
    console.log("OpenAI replied...", output.text);

    setApiOutput(output.text);
    speakOutput(output.text);
    setIsGenerating(false);
    
    const synth = window.speechSynthesis;
    setSynth(synth);

    const speakOutput = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    };  
  };  



  const onUserChangedText = (event) => {
  setUserInput(event.target.value);
  }; 

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callGenerateEndpoint();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };
    recognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.stop();
    recognition = null;
    console.log(recognition);
    console.log('stopRecording called');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording(recognition);
    } else {
      startRecording();
    }
  };


;

  return (
    <div className="root" onKeyDown={onKeyDown}>
      <Head>
        <title>Chat2GPT</title>
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
        
        <button className="generate-button" onClick={toggleRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <div className="prompt-container">
          <textarea placeholder="e.g. chess" className="prompt-box" value={userInput} onChange={onUserChangedText}/>
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
