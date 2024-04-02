import { useEffect, useState } from 'react'
import { LocationOff, LocationOn, Mic, MicOff } from '@mui/icons-material'
import { Alert, Slide, Snackbar, ToggleButton } from '@mui/material'
import { findCurrentLocation, getMicrophoneStats, uploadLoudness } from '../../scripts/Firebase'
import './index.css'


const Permissions = () => {
    const [enabled, setEnabled] = useState<boolean>(false)
    const [locationInterval, setLocationInterval] = useState<NodeJS.Timeout>();
    const [audioInterval, setAudioInterval] = useState<NodeJS.Timeout>();
    const [open, setOpen] = useState<boolean>(false)

    const close = () => {
        setOpen(false)
    }

    const togglePermissions = async () => {
        try {
            if ("geolocation" in navigator) {
                await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
            } else {
                console.log("Geolocation is not available in your browser.");
            }
            await getMicrophoneStats();
            setEnabled(!enabled)
        } catch {
            setEnabled(false)
            setOpen(true) // show error snackbar
            console.error("Failed to enable permissions")
        }
        
    }

    // request on start up
    useEffect(() => {
        togglePermissions();
    }, [])

    
    useEffect(() => {
        if (enabled) {
            findCurrentLocation();
            setTimeout(uploadLoudness, 15000);
            // query location, audio every 10 minutes
            setLocationInterval(setInterval(findCurrentLocation, 600000));
            setAudioInterval(setInterval(uploadLoudness, 600000));
        } else {
            clearInterval(locationInterval);
            clearInterval(audioInterval);
        }
    }, [enabled])

    return (
        <>
        <ToggleButton className='permissionContainer' value={enabled} onClick={togglePermissions}>
            {enabled ? <Mic className='icons' /> : <MicOff className='icons' />}
            {enabled ? <LocationOn className='icons' /> : <LocationOff className='icons' />}
        </ToggleButton>  
        <Snackbar open={open} autoHideDuration={3000} onClose={close} TransitionComponent={Slide}>
        <Alert
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
        >
            Permissions Not Granted
        </Alert>
        </Snackbar>
        </>         
    )
}

export default Permissions