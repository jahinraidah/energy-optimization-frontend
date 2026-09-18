import { useState } from 'react'


function Jsoninspector({ data }){
     const [open, setOpen] = useState(false)
 

  if (!data) {
    return (
      <div className="jsoninspector">
        <p className="empty-state">No result yet — run an optimization to see the response here.</p>
      </div>
    )
  }
 

 return( <div className="jsoninspector">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Hide' : 'Show'} raw JSON response
      </button>
      {open && (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>



 );

}
export default Jsoninspector