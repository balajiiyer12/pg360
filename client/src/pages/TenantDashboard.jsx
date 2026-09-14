import { useAuth } from "../context/AuthContext";

function TenantDashboard(){
    const {user}= useAuth();
    return(

        <div>
             Hello {user.name}
        </div>
    )
}

export default TenantDashboard;