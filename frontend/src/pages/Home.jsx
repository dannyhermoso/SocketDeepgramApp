import React, { useEffect, useState, useRef } from "react";
import './Home.css'
import axios from 'axios'
import { postNote, everyNote } from "../utils/APIRoutes";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
const API_KEY = '2ecb853d179886a346b48593ab32eaf849fe1d00'
var mediaRecorder; // set mediaRecorder as  an globally accessible
var audioText;


const Home = () => {


  



    let currentText = ''; // if you want record all audio even if you stoped and restart MediaRecorder, so you should set it as a global variable

    const [record, setRecord] = useState(false);
    const [text, setText] = useState('');
    const [cc, setCc] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [allNotes, settAllNotes] = useState([])
    const [messages, setMessages] = useState([])

    const startRec = () => {
      setRecord(true);
      setText('');
    };

    
  
    const stopRec = async () => {
      if (record && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().filter((i) => i.stop());
        mediaRecorder = null;
      }
      setRecord(false);
    };
  
    const deepGramAudio2text = () => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          return alert('Browser not supported');
        }
  
        var options = { mimeType: 'video/webm' };
        mediaRecorder = new MediaRecorder(stream, options);
  
        const socket = new WebSocket(`wss://api.deepgram.com/v1/listen`, [
          'token',
          API_KEY,
        ]);
  
        socket.onopen = () => {
          mediaRecorder.addEventListener('dataavailable', async (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });
        };
  
        mediaRecorder.start(1100);
        console.log('started');
  
        socket.onmessage = async (message) => {
          const received = JSON.parse(message.data);
          const transcript = received.channel.alternatives[0].transcript;
          if (transcript && received.is_final) {
            currentText = currentText.concat(' ' + transcript);
            audioText = currentText;
            console.log(audioText);
            setText(audioText);
            
          }
        };
      });
    };
  
    useEffect(() => {
      if (record) {
        deepGramAudio2text();
      }
    }, [record]);

    
    

    useEffect(() => {

      const traerNotas = async() => {
      const notas = await axios.post(everyNote)
      settAllNotes(notas.data.notes.map((note) => note.description))

      
      }
      
      const info = traerNotas().catch(console.error)

    }, [])
  
    let leters = text.split(' ');
    let last2 = leters.slice(-2);



    const [nuevoTexto, setNuevoTexto] = useState('')

    useEffect(() => {
      socket.on('text', (text) => setNuevoTexto(text))

      return(() => {
        socket.off('text', text => setNuevoTexto(text))
      })
    }, []);





    const handlePostNote = async () => {
      
     const nuevaNota = await axios.post(postNote, { description: text})

      settAllNotes([...allNotes, nuevaNota.data.newNote.description])

      const newMessage = nuevaNota.data.newNote.description
    
     socket.emit('text', text)
    }



    const [newAudioText, setNewAudioText] = useState('')
    
    useEffect(() => {
      if(record){
        socket.emit('record', text)
        console.log(record)

      }

      socket.on('record', (text) => setNewAudioText(text))

      return(() => {
        socket.off('record', text => setNewAudioText(text))
      })
    }, [record, text])


    const [formulario, setFormulario] = useState('')
    

    const handleChangeInput = (e) => {
      e.preventDefault()
      setFormulario('text')
    }


    const handleBefore = () => {
      alert('Record something first')
    }

return (
    <div>
        <div className='homePage'>

            <h1>Real-time Note Taker</h1>
        
        {/* {newAudioText} */}
        
        <div className="botones">
        <button onClick={startRec} type='button' id='start'>
          Start
        </button>
        <button onClick={stopRec} type='button' id='stop'>
          Stop
        </button>
        </div>
       
       {text && text!=='' || newAudioText !== ''? 
       (<button className='buttonPost' onClick={() => handlePostNote()}>POST A NEW NOTE</button>)
      :
      (<button className='buttonBefore' onClick={() => handleBefore()}>Please record something before posting</button>)
      }
        

        <div className="glassmorph">
        <h6 className="text-box">{text && text!=='' ? text : newAudioText}</h6>

        
        
        </div>
        
      </div>
      {allNotes && allNotes.length>0 ?
        allNotes.map((note) => {
          return(
            <h3>{note}</h3>
          )
        })
      :
      (<div></div>)}


      <h3>{nuevoTexto}</h3>
      
    </div>
)


}

export default Home