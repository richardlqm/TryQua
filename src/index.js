import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
// Then register the languages you need
hljs.registerLanguage("python", python);
hljs.configure({
  languages: ["python"],
  cssSelector: "code.language-python",
  ignoreUnescapedHTML: true,
});
hljs.highlightAll();

var FILES = [
  {
    title: "A simple hello world",
    name: "hello.py",
  },
  { title: "A complex calculation", name: "calculation.py" },
];

function loadFile({ name, title }) {
  let titleEl = document.querySelector("#title");
  titleEl.innerText = title;
  let path = `static/python-examples/${name}`;

  fetch(path).then((response) => {
    var codeEl = document.querySelector("code.language-python");
    // trim and set the response
    response.text().then((text) => {
      codeEl.textContent = text.trim();
      hljs.highlightBlock(codeEl);
    });
    // on change, type or modify rehighlight
    const listeners = ["input", "change"];
    listeners.forEach((listener) => {
      // get selection, keep it and set it after
      codeEl?.addEventListener(listener, (e) => {
        // let codeText = e.target.textContent;
        // re highlight and set selection back
        // const selectionStart = window.getSelection().getRangeAt(0).startOffset;
        // hljs.highlightElement(codeEl);
        // A bug with the cursor jumping always to the beginning blocks me
        // console.log(selectionStart);
        // hljs.highlightBlock(codeEl);
        // window.getSelection().getRangeAt(0).setStart(codeEl, selectionStart);
      });
    });
  });
}

async function evaluatePython(pyodide) {
  console.log("evaluatePython");
  if (!pyodide) {
    console.log("pyodide not ready");
    return;
  }
  var codeEl = document.querySelector("code.language-python");
  let resultEl = document.getElementById("result");
  console.log(codeEl?.textContent);
  resultEl.innerText = pyodide.runPython(codeEl?.textContent);
}

function setupLinks(FILES) {
  // write a list of A links in a UL with {name, title}
  let filesEl = document.querySelector("div#file-list");
  FILES.forEach(({ name, title }) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      loadFile({ name, title });
    });
    console.log(name, title);
    li.appendChild(a);
    filesEl?.appendChild(li);
  });
}

async function main() {
  setupLinks(FILES);
  loadFile({
    title: "A simple hello world",
    name: "hello.py",
  });
  let pyodide = await loadPyodide();
  var runButton = document.getElementById("run");
  runButton.addEventListener("click", () => evaluatePython(pyodide));
  await pyodide.loadPackage("numpy");
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
