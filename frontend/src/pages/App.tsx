import { Router, Route } from "preact-router"
import { Navbar } from "../components/Navbar"
import Main from "../components/Main"
import History from "../components/History"
import Dashboard from "../components/Dashboard"
import TrainsetManagement from "../components/TrainsetManagement"
import TestsetManagement from "../components/TestsetManagement"
import { Footer } from "../components/Footer"
import '../styles/base.sass'
import '../styles/history.sass'
import '../styles/pagination.sass'
import '../styles/dashboard.sass'


export function App(props: any) {
    return (
        <div id="App">
            <Navbar />
            <Router>
                <Route path="/" component={Main} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/history" component={History} />
                <Route path="/dashboard/datasets" component={TrainsetManagement} />
                <Route path="/dashboard/testsets" component={TestsetManagement} />
            </Router>
            <Footer />
        </div>
    )
}