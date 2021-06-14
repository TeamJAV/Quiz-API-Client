import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionEditor from "./components/QuestionEditor";

function App() {
    const question = { choices: { A: "as", B: "to", C: true, D: false }, questionType: "multiple" };
    return (
        <div className="App">
            <QuestionEditor question={question}></QuestionEditor>
        </div>
    );
}

export default App;
