import './App.css'
import logo from "./assets/images/logo-universal.png"
import {Greet} from "../wailsjs/go/main/App";
import {useState} from "preact/hooks";
import {h} from 'preact';

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
            <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input"
                        type="text"/>
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}
