import { DetailedHTMLProps, ImgHTMLAttributes, useRef, useState } from "react"
import logo from "./logo.png"
import { Box, Popover, ToggleButton, Typography } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check'
import './index.css'
import { toggleMicrophone } from "../../scripts/microphone"


const Logo = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const [open, setOpen] = useState<boolean>(false)
    const [recording, setRecording] = useState<boolean>(false)

    const handleClick = (event: React.MouseEvent<HTMLImageElement   >) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
      };
    
      const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
      };

    return <>
        <img className="logo" src={logo} alt="zenzone logo" onClick={handleClick} {...props}/>
        <Popover
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
                            toggleMicrophone()
                            setRecording(!recording);
                        }}
                        >
                            <CheckIcon />
                    </ToggleButton>
                </div>
        </Popover>
    </>
}

export default Logo;