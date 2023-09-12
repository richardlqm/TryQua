const output = document.getElementById("output");
const code = document.getElementById("code");
const mycode = document.getElementById("mycode");

function addToOutput(s) {
    output.value += ">>>" + code.value + "\n" + s + "\n";
}

output.value = "Initializing...\n";
// init Pyodide
async function main() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    output.value += "Ready!\n";

    return pyodide;
}
let pyodideReadyPromise = main();

async function evaluatePython() {
    let pyodide = await pyodideReadyPromise;
    try {
        let output = pyodide.runPython(code.value);
        addToOutput(output);

        let url = 'http://localhost:8000/simple.py';
        let pycode = await load_code_from_url(url);
        output = pyodide.runPython(pycode);
        addToOutput(output);
    } catch (err) {
        addToOutput(err);
    }
}
async function load_code_from_url(url) {
    let response = await fetch(url, {redirect: "follow"});
    let data = await response.text();
    return data;
}