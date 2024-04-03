import { Chip, LinearProgress } from '@mui/material'
import './index.css'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type LevelType = 'sound' | 'busy'

interface LevelCardProps {
    title: string,
    value: number,
    type: LevelType,
}

const valueToColor = (value: number, type: LevelType) => {
    const soundLevels = [20, 40, 60, 80, 120]; // in dB
    const busyLevels = [20, 40, 60, 80, 95]; // in % (subject to change)
    const colors = ["#7765AC", "#4D74B2", "#659360", "#FCB955", "#E95658"];
    const soundLabels = ["FAINT", "SOFT", "MODERATE", "LOUD", "VERY LOUD"];
    const busyLabels = [
        "NOT BUSY",
        "NOT VERY BUSY",
        "NORMAL",
        "BUSY",
        "VERY BUSY",
    ];
    const chosenLevels = type === "busy" ? busyLevels : soundLevels;
    const chosenLabels = type === "busy" ? busyLabels : soundLabels;
    for (let i = 0; i < colors.length; i++) {
        if (value <= chosenLevels[i]) {
            return (
            <Chip label={chosenLabels[i]} variant="filled" sx={{
                backgroundColor: colors[i],
                marginLeft: 1,
            }} />
            );
        }
    }
    return (
        <Chip label={chosenLabels[chosenLabels.length - 1]} variant="filled" sx={{
            backgroundColor: colors[colors.length - 1],
            marginLeft: 1,
        }} />
    );
};


const LevelCard = (props: LevelCardProps) => {
    const label = valueToColor(props.value, props.type)

    return (
        <div className="levelCard">
            <div className="levelCardTitle">
                <h4>{props.title} {label}</h4>
                <p>{props.value}{props.type === 'busy' ? '%' : 'dB'}</p>
            </div>
            {/* <LinearProgress title={props.title} variant="determinate" value={props.value} sx={{'& .MuiLinearProgress-bar': {backgroundColor: color}}}/> */}
        </div>
    )
}

export default LevelCard