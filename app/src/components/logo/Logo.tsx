import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import logo from "./logo.png"
import './index.css'


{/* <Popover
            anchorEl={anchorEl}
            onClose={handleClose}
            open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}>
                <div className="toggleContainer">
                    <Typography>
                        Toggle Record
                    </Typography>
                    <ToggleButton
                        value="check"
                        selected={recording}
                        onChange={() => {
                            getMicrophoneStats()
                            setRecording(!recording);
                        }}
                        >
                            <CheckIcon />
                    </ToggleButton>
                </div>
                <div className="toggleContainer">
                    <Typography>
                        Toggle Location
                    </Typography>
                    <ToggleButton
                        value="check"
                        selected={locationRec}
                        onChange={() => {
                            // Query location every ten minutes
                            if (!locationRec) {
                                findCurrentLocation();
                                locationInterval = setInterval(findCurrentLocation, 600000);
                            } else if (locationInterval) {
                                clearInterval(locationInterval);
                            }
                            setLocationRec(!locationRec);
                        }}
                        >
                            <CheckIcon />
                    </ToggleButton>
                </div>
        </Popover> */}

const Logo = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    return <img className="logo" src={logo} alt="zenzone logo" {...props}/>
}

export default Logo;