function LandingPage(){
    return(
        <div className="flex flex-col min-h-screen">
            <header className="flex justify-between m-2 p-4">
                <div>PG360</div>
                <div>Features</div>
                <div>Pricing</div>
                <button>Login</button>
            </header>

            <main className="grow">
                {/* left section */}
                <div>
                    <h1>PG Management System</h1>
                    <p>Complete solution at one Place.No Manual Headache</p>
                    <button>Get Started</button>
                </div>
                {/* right section */}
                <div>
                    
                </div>
            </main>

            <footer>
                Developed By Balaji Iyer 
            </footer>
        </div>
    );
}

export default LandingPage;