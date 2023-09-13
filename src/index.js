// Importing highlight.js
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";

// Registering the Python language
hljs.registerLanguage("python", python);

hljs.configure({
  languages: ["python"],
  cssSelector: "code.language-python",
  ignoreUnescapedHTML: true,
});

hljs.highlightAll();

// Class definition for file loading and handling
class FileHandler {
  constructor() {
    this.FILES = [
      { title: "A simple hello world", name: "hello.py" },
      { title: "A complex calculation", name: "calculation.py" },
      { title: "CPMG Example", name: "cpmg.py" },
      { title: "Frame Rotation example", name: "frame_rotation.py" },
      { title: "Phase Coherence example", name: "phase_coherence.py" },
      { title: "Power Rabi example", name: "power_rabi.py" },
    ];
  }

  async loadFile({ name, title }) {
    document.querySelector("#title").innerText = title;
    const path = `static/python-examples/${name}`;

    const response = await fetch(path);
    let codeEl = document.querySelector("code.language-python");

    const text = await response.text();
    codeEl.textContent = text.trim();
    hljs.highlightBlock(codeEl);

    ["input", "change"].forEach((listener) => {
      codeEl.addEventListener(listener, (e) => {
        // Code highlighting logic
      });
    });
  }
}

// Class definition for Python evaluation
class PythonEvaluator {
  async evaluatePython(pyodide) {
    if (!pyodide) {
      console.log("pyodide not ready");
      return;
    }

    let codeEl = document.querySelector("code.language-python");
    let resultEl = document.getElementById("result");

    resultEl.innerText = pyodide.runPython(codeEl.textContent);
  }

  quaLoader(pyodide, pckg) {
    return pyodide.loadPackage(`static/python-examples/packages/${pckg}`);
  }
}

// Setup links
function setupLinks(FILES) {
  let filesEl = document.querySelector("div#file-list");
  FILES.forEach(({ name, title }) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler();
      fileHandler.loadFile({ name, title });
    });

    li.appendChild(a);
    filesEl.appendChild(li);
  });
}

async function main() {
  let fileHandler = new FileHandler();
  setupLinks(fileHandler.FILES);

  fileHandler.loadFile({
    title: "A simple hello world",
    name: "hello.py",
  });

  let pyodide = await loadPyodide();
  document
    .getElementById("run")
    .addEventListener("click", () =>
      new PythonEvaluator().evaluatePython(pyodide)
    );

  await new PythonEvaluator().quaLoader(pyodide, "qua_emulator.whl");
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);
