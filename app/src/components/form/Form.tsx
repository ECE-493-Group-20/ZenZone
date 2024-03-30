import { Button, Slider, SxProps } from '@mui/material'
import './index.css'
import { useState } from 'react'
import { Check, Close } from '@mui/icons-material'

type LevelType = 'sound' | 'busy'

interface FormProps {
    close: () => void
}

const Form = (props: FormProps) => {
    const [soundLevel, setSoundLevel] = useState<number>(60)
    const [busyLevel, setBusyLevel] = useState<number>(50)


    const valueToColor = (value: number, type: LevelType) => {
        const soundLevels = [20, 40, 60, 80, 120] // in dB
        const busyLevels = [20, 40, 60, 80, 95] // in % (subject to change)
        const colors = ['#7765AC', '#4D74B2', '#659360', '#FCB955', '#E95658']
        const chosenLevels = type == 'busy' ? busyLevels : soundLevels
    
        for (let i = 0; i < colors.length; i++) {
            if (value <= chosenLevels[i]) {
                return colors[i]
            }
        }
        return colors[colors.length - 1] // default return last value in colors
    }

    const soundColor = valueToColor(soundLevel, 'sound')
    const busyColor = valueToColor(busyLevel, 'busy')

    const sliderStyle: {[key: string]: SxProps} = {
        sound: {
            '& .MuiSlider-track': {
                backgroundColor: soundColor,
                height: '10px',
                borderRadius: '2px',
                border: '1px solid #383F51',
                transition: '1s'
            },
            '& .MuiSlider-rail': {
                backgroundColor: soundColor,
                height: '10px',
                borderRadius: '2px',
                transition: '1s'
            },
            '& .MuiSlider-thumb': {
                backgroundColor: '#383F51',
                borderRadius: '1px',
            },
        },
        busy: {
            '& .MuiSlider-track': {
                backgroundColor: busyColor,
                height: '10px',
                borderRadius: '2px',
                border: '1px solid #383F51',
                transition: '1s'
            },
            '& .MuiSlider-rail': {
                backgroundColor: busyColor,
                height: '10px',
                borderRadius: '2px',
                transition: '1s'
            },
            '& .MuiSlider-thumb': {
                backgroundColor: '#383F51',
                borderRadius: '1px',
            },
        },
    }

    return (
        <div className="form">
            <h1>Manual Input</h1>

            <div className="levelCardTitle">
                <h4>Sound Level</h4>
                <p>{soundLevel}dB</p>
            </div>
            <Slider value={soundLevel} onChange={(_, value) => setSoundLevel(value as number)} sx={sliderStyle['sound']}/>
            
            <div className="levelCardTitle">
                <h4>Busy Level</h4>
                <p>{busyLevel}%</p>
            </div>
            <Slider value={busyLevel} onChange={(_, value) => setBusyLevel(value as number)} sx={sliderStyle['busy']}/>
            
            <Button className='button' startIcon={<Check />}>Submit</Button>
            <Button className='button' onClick={props.close} startIcon={<Close />}>Cancel</Button>
        </div>
    )
}

export default Form