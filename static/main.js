const output = document.getElementById("output");
const code = document.getElementById("code");
function addToOutput(s) {
    output.value += ">>>" + code.value + "\n" + s + "\n";
}

output.value = "Initializing...\n";
// init Pyodide
async function main() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    let qua_emulator = await pyodide.loadPackage(
        "http://localhost:3000/qua_emulator-1.2.12-py3-none-any.whl",
    );
    output.value += "Ready!\n";
    return pyodide;
}
let pyodideReadyPromise = main();

async function evaluatePython() {
    let pyodide = await pyodideReadyPromise;
    try {
        let output = pyodide.runPython(code.value);
        addToOutput(output);
    } catch (err) {
        addToOutput(err);
    }
}

a