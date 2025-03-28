import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create root
const root = createRoot(document.getElementById("root")!);

// Render app
root.render(<App />);
