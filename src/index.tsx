/* @refresh reload */
import "virtual:uno.css";
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
