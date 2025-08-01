import '../css/defaults.css'
import '../css/mobile.css'

function NavMobile() {
    return(
        <div className="nav-mobile">
            <div className="holder">
                <div className="logo icon">
                    <a href="#landing"><h1>@rshs</h1></a>
                </div>
                <div className="logo search">
                    <h1>Search</h1>
                </div>
                <div className="logo menu">
                    <h1>Menu</h1>
                </div>
            </div>
        </div>
    )
}

export default NavMobile