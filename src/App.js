import { useState, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Router from "./components/commons/Routes";
import UserContext from "./context/UserContext";

function App() {
    const [user, setUser] = useState(null);
    const memoUser = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <Container className="App">
            <UserContext.Provider value={memoUser}>
                <Router></Router>
            </UserContext.Provider>
        </Container>
    );
}

export default App;
