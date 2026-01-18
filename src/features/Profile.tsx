import { authService } from '../services/authService';
const Profile = () => {
    return (
        <div>
            <h1>Profile</h1>
            <button onClick={() => {
                authService.logout()
                alert("Signed out successfully");
            }}>Sign Out</button>
        </div>
    );
};

export default Profile;