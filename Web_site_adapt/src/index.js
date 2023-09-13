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

  quaLoader(packages) {
    var arr = packages.map((pckg) =>
      this.pyodide.loadPackage(`static/python-examples/packages/${pckg}`)
    );
    var dstpckgs = ["numpy", "setuptools", "ssl"];
    dstpckgs.forEach((dist_pckg) => {
      console.log("adding: " + dist_pckg);
      arr.push(this.pyodide.loadPackage(dist_pckg));
    });
    return Promise.all(arr);
  }
}

// Setup links
function setupLinks({ files, filesEl, codeEl, descrEl, titleEl }) {
  /* 
          <div class="program-3-page-1">
          <div class="program-3-page-1-inner">
            <div class="program-3-page-1-inner">
              <div class="q-randomized-benchmarking-container">
                <span class="span">2</span>Q Randomized Benchmarking
              </div>
            </div>
          </div>
        </div>
  */
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
  let files = await (
    await fetch("static/python-examples/examples.json")
  ).json();
  let setupElements = {
    files: files,
    codeEl: document.getElementById("quaCode"),
    resultEl: document.getElementById("result"),
    titleEl: document.getElementById("title"),
    descrEl: document.getElementById("description"),
    filesEl: document.getElementById("file-list"),
    pyodide: null,
  };
  let runButton = document.getElementById("run");
  // @ts-ignore
  //runButton.disabled = true;
  setupLinks(setupElements);
  setupElements.pyodide = await pyodide;
  let pyEval = new PythonEvaluator(setupElements);
  let fileHandler = new FileHandler(setupElements);

  fileHandler.loadFile(setupElements.files[0]);
  let pckgs = await (
    await fetch("/static/python-examples/packages/pckgindex.json")
  ).json();
  pyEval.quaLoader(pckgs).then(() => {
    // @ts-ignore
    //runButton.disabled = false;
    runButton?.addEventListener("click", () => pyEval.evaluatePython());
  });
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);
