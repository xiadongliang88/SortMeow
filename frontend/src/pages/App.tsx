

import logo from "./assets/images/logo-universal.png"
import {Greet} from "../../wailsjs/go/main/App"
import {useState} from "preact/hooks"
import {Navbar} from "../components/Navbar"
import {Main} from "../components/Main"
import {Footer} from "../components/Footer"
import '../styles/base.sass'


export function App(props: any) {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    const greet = async() => {
        const result = await (window as any).go.main.App.Greet("World")
        console.log('result', result)

        Greet(name).then(updateResultText);
    }

    return (
        <div id="App">
            <Navbar />
            <Main />
            <Footer />
        </div>
    )
}
