import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";

function HostelPage(){
    return (
        <div className="flex flex-col min-h-screen">
            <LoggedInNavbar></LoggedInNavbar>
            <main className="grow flex flex-col">
                <div>Akhil PG</div>
                <div className="flex w-[100%]">
                    <div>Manage Rooms</div>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}

export default HostelPage;