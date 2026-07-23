import { Router, Route } from "preact-router"
import Navbar from "../components/Navbar"
import Main from "../components/Main"
import History from "../components/History"
import { Footer } from "../components/Footer"
import '../styles/base.sass'
import '../styles/history.sass'
import '../styles/pagination.sass'

export function App() {
    return (
        <div id="App">
            <Navbar />
            <Router>
                <Route path="/" component={Main} />
                <Route path="/history" component={History} />
            </Router>
            <Footer />
        </div>
    )
}