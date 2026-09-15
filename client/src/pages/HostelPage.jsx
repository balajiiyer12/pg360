import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";

function HostelPage(){
    return (
        <div className="flex flex-col min-h-screen">
            <LoggedInNavbar></LoggedInNavbar>
            <main>
                Hello
            </main>
            <Footer></Footer>
        </div>
    );
}

export default HostelPage;