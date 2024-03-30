import { DetailedHTMLProps, HTMLAttributes, useState } from 'react'
import './index.css'
import { LocationOff, LocationOn, Mic, MicOff } from '@mui/icons-material'



const Permissions = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {

    const [sound, setSound] = useState<boolean>(false)
    const [location, setLocation] = useState<boolean>(false)

    return (
        <div {...props} className='permissionContainer'>
            {sound ? <Mic className='icons' onClick={() => setSound(!sound)}/> : <MicOff className='icons' onClick={() => setSound(!sound)}/>}
            {location ? <LocationOn className='icons' onClick={() => setLocation(!location)}/> : <LocationOff className='icons' onClick={() => setLocation(!location)}/>}
        </div>
    )
}

export default Permissions