import { useState } from 'react'
import Energybar from './Components/Energybar.jsx';
import Jsoninspector from './Components/Jsoninspector.jsx';
import './App.css'

function App() {
  const [result, setResult] = useState(null)

  return (
    <>
     <Energybar onResult={setResult}/>
     <Jsoninspector data={result}/>
      
  
  
    </>
  )
}

export default App 
