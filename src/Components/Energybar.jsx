import { useState } from 'react'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
function formatHour(hour) {
  const period = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
 return displayHour + ':00 ' + period +":  "
}

function Energybar({ onResult }) {
  const [loads, setLoads] = useState(HOURS.map(() => 50))
  const [notes, setNotes] = useState([''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateLoad = (hour, value) => {
    const next = [...loads]
    next[hour] = Number(value)
    setLoads(next)
  }

  const updateNote = (index, value) => {
    const next = [...notes]
    next[index] = value
    setNotes(next)
  }

  const addNote = () => {
    if (notes.length < 3) setNotes([...notes, ''])
  }

  const removeNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index))
  }

  const submitScenario = async () => {
    setLoading(true)

    setError(null)
    try {
      const payload = {
        intervals: HOURS.map((hour) => ({ hour, forecastLoad: loads[hour] })),
        operatorNotes: notes.filter((n) => n.trim() !== '')
      }
//gotta change from here
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/optimize`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
if (!res.ok) throw new Error(`Request failed: ${res.status}`)
const data = await res.json()
onResult(data)
    
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="energybar">

      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Energy Consumption Expectation</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>Enter the expected energy usage for each hour of the day, in 12-hour format.</p>

      {/* <div className="hour-grid">
        {HOURS.map((hour) => (
          <div key={hour} className="hour-cell">
           <label>{formatHour(hour)}</label>
    

            <input
              type="number"
              min="0"
              value={loads[hour]}
              onChange={(e) => updateLoad(hour, e.target.value)}
            />
          </div>
        ))}
      </div> */}

      
      <div className ="slider-grid" style ={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(24, 1fr)', 
        gap: '6px', 
        background: '#ffffff', 
        padding: '20px 60px 30px 20px', 
        borderRadius: '8px', 
        border: '1px solid #e8eef7',
        height: '240px',
        alignItems: 'end',
        marginBottom: '24px',
        boxSizing:'border-box',
        overflowX:'auto',
        width:'100%'


      }}>
        {HOURS.map((hour) => {
          const value = loads[hour] || 0;
          const barColor = value > 70 ? '#ef4444' : value > 40 ? '#f59e0b' : '#3b82f6';
          
          return (
            <div key={hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', color: barColor, marginBottom: '4px' }}>{value}</span>
              
              <div style={{ position: 'relative', width: '100%', height: '140px', display: 'flex', justifyContent: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => updateLoad(hour, e.target.value)}
                  style={{
                    WebkitAppearance: 'slider-vertical',
                    width: '12px',
                    height: '140px',
                    background: '#f1f5f9',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '8px', transform: 'rotate(-54deg)', whiteSpace: 'nowrap', height: '20px' }}>
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : (hour % 12) + (hour < 12 ? ' AM' : ' PM')}
              </span>
            </div>
          );
        })}
      </div>
      

      <div className="notes-section">
        <h3>Operator Notes</h3>
        {notes.map((note, i) => (
          <div key={i} className="note-row">
            <input
              type="text"
              placeholder="e.g. Avoid cooling load in Block C after 6pm"
              value={note}
              onChange={(e) => updateNote(i, e.target.value)}
            />
            {notes.length > 1 && (
              <button onClick={() => removeNote(i)}>✕</button>
            )}
          </div>
        ))}
        {notes.length < 3 && (
          <button onClick={addNote}>+ Add note</button>
        )}
      </div>

      {error && <p className="error">{error}</p>}


      <button onClick={submitScenario} disabled={loading}>
        {loading ? 'Optimizing...' : 'Run Optimization'}
      </button>
    </div>
  )
}

export default Energybar