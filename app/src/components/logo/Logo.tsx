import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import logo from "./logo.png"


const Logo = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    return <img src={logo} {...props}/>
}

export default Logo;