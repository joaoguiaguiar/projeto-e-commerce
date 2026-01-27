import { Outlet } from "react-router-dom"
import Rodape from "../../components/Rodape"
import Header from "../../components/Header"

const PaginaBase = () => {
    return (<main>
        <Header/>
        <Outlet />
        <Rodape />
    </main>)
}

export default PaginaBase