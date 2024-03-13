import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import logo from "./logo.png"


const Logo = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    return <img src={logo} alt="zenzone logo" {...props}/>
}

export default Logo;