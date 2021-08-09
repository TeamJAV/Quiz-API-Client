import Container from "react-bootstrap/Container";
import Router from "./components/commons/Routes";
import { UserProvider } from "./context/UserContext";
import { RoomProvider } from "./context/RoomContext";

function App() {
    return (
        <UserProvider>
            <RoomProvider>
                <Container className="App">
                    <Router></Router>
                </Container>
            </RoomProvider>
        </UserProvider>
    );
}

export default App;
