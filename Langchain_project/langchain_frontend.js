import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [files, setFiles] = useState([]);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);

    const uploadFiles = async () => {
        const formData = new FormData();
        for (let file of files) {
            formData.append("files", file);
        }

        await axios.post("http://localhost:8000/upload", formData);
        alert("PDFs processed!");
    };

    const sendQuestion = async () => {
        const userMsg = { role: "user", content: question };
        setMessages([...messages, userMsg]);

        const response = await axios.post("http://localhost:8000/ask", {
            question: question,
        });

        const botMsg = {
            role: "bot",
            content: response.data.answer,
            sources: response.data.sources,
        };

        setMessages((prev) => [...prev, botMsg]);
        setQuestion("");
    };

    return (
        <div className="container">
            <h1>Chat with PDFs</h1>

            <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
            />
            <button onClick={uploadFiles}>Upload PDFs</button>

            <div className="chat">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <p>{msg.content}</p>
                        {msg.sources && (
                            <div className="sources">
                                <strong>Sources:</strong>
                                {msg.sources.map((src, i) => (
                                    <p key={i}>{src}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="input-area">
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button onClick={sendQuestion}>Send</button>
            </div>
        </div>
    );
}

export default App;