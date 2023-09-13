// Importing highlight.js
// @ts-ignore
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
// import pyodide, { loadPyodide } from "pyodide/pyodide.js";

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
  constructor({ files, codeEl, titleEl, descrEl }) {
    this.codeEl = codeEl;
    this.titleEl = titleEl;
    this.files = files;
    this.descrEl = descrEl;
  }

  async loadFile({ name, title, description }) {
    this.titleEl.innerText = title;
    this.descrEl.innerText = description;

    const path = `static/python-examples/${name}`;
    const response = await fetch(path);
    const text = await response.text();
    this.codeEl.textContent = text.trim();
    hljs.highlightBlock(this.codeEl);

    ["input", "change"].forEach((listener) => {
      // @ts-ignore
      this.codeEl.addEventListener(listener, (e) => {
        // Code highlighting logic
      });
    });
  }
}

// Class definition for Python evaluation
class PythonEvaluator {
  constructor({ pyodide, codeEl, resultEl }) {
    this.pyodide = pyodide;
    this.resultEl = resultEl;
    this.codeEl = codeEl;
  }

  async evaluatePython() {
    if (!this.pyodide) {
      console.log("pyodide not ready");
      return;
    }

    this.resultEl.innerText = this.pyodide.runPython(this.codeEl.textContent);
  }

  quaLoader(pckg) {
    return this.pyodide.loadPackage(`static/python-examples/packages/${pckg}`);
  }
}

// Setup links
function setupLinks({ files, filesEl, codeEl, descrEl, titleEl }) {
  files.forEach(({ name, title, description }) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler({ titleEl, codeEl, descrEl, files });
      fileHandler.loadFile({ name, title, description });
    });

    li.appendChild(a);
    // @ts-ignore
    filesEl.appendChild(li);
  });
}

async function main() {
  // @ts-ignore
  let pyodide = loadPyodide();
  let setupElements = {
    files: [
      {
        title: "Hello World",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.lo world program for the broser",
        name: "hello.py",
      },
      {
        title: "Calculation",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo",
        name: "calculation.py",
      },
      {
        title: "CPMG",
        description:
          " Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt",
        name: "cpmg.py",
      },
      {
        title: "Frame Rotation",
        description:
          "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        name: "frame_rotation.py",
      },
      {
        title: "Phase Coherence",
        description:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        name: "phase_coherence.py",
      },
      {
        title: "Power Rabi example",
        description:
          "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
        name: "power_rabi.py",
      },
    ],
    codeEl: document.querySelector("code.language-python"),
    resultEl: document.getElementById("result"),
    titleEl: document.querySelector("#title"),
    descrEl: document.querySelector("#description"),
    filesEl: document.querySelector("div#file-list"),
    pyodide: null,
  };
  let runButton = document.getElementById("run");
  // @ts-ignore
  runButton.disabled = true;
  setupLinks(setupElements);
  setupElements.pyodide = await pyodide;
  let pyEval = new PythonEvaluator(setupElements);
  let fileHandler = new FileHandler(setupElements);

  fileHandler.loadFile(setupElements.files[0]);
  pyEval.quaLoader("qua_emulator.whl").then(() => {
    // @ts-ignore
    runButton.disabled = false;
    runButton?.addEventListener("click", () => pyEval.evaluatePython());
  });
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);
