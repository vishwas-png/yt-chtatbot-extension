import { useState, useEffect } from 'react'

function App() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [videoId, setVideoId] = useState('')

  useEffect(() => {
    // runs once when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      const urlParams = new URLSearchParams(new URL(url).search)
      const id = urlParams.get('v')
      if (id) {
        setVideoId(id)
      }
    })
  }, [])

   const handleAsk = async () => {
    setResponse('Thinking...')
       try {
      const res = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, question })
      })

      const data = await res.json()
      setResponse(data.answer)

    } catch (err) {
      setResponse('Error connecting to backend!')
    }
  }

  return (
    <div style={{ width: '350px', padding: '16px', fontFamily: 'Arial' }}>
      <h3>YT Chatbot</h3>
      {videoId 
        ? <p style={{ fontSize: '12px', color: 'green' }}>✅ Video detected: {videoId}</p>
        : <p style={{ fontSize: '12px', color: 'red' }}>❌ No video detected</p>
      }
      <input
        type="text"
        placeholder="Ask something about the video..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
      <button
        onClick={handleAsk}
        style={{
          width: '100%', padding: '8px', marginTop: '8px',
          background: 'red', color: 'white', border: 'none',
          borderRadius: '4px', cursor: 'pointer'
        }}
      >
        Ask
      </button>
      {response && (
        <p style={{ marginTop: '12px', fontSize: '13px' }}>{response}</p>
      )}
    </div>
  )
}

export default App