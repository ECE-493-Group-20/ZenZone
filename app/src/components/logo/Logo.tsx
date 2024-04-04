import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import logo from "./logo.png"
import './index.css'

const Logo = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    return <img className="logo" src={logo} alt="zenzone logo" {...props}/>
}

export default Logo;