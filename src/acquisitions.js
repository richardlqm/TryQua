import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

function createChart(id, title) {
  const existingChart = Chart.getChart(id);
  if (existingChart) {
    existingChart.destroy();
  }

  return new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: "signal (V)",
          },
        },
        x: {
          title: {
            display: true,
            text: "time (ns)",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: "alt",
          },
          zoom: {
            drag: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    },
  });
}

function addResetZoomEventListener(chart, btnId) {
  document.getElementById(btnId).addEventListener("click", function () {
    chart.resetZoom();
  });
}

function updateChart(chart, labels, datasets) {
  chart.config.data.labels = labels;

  datasets.forEach(({ label, values }) => {
    let dataset = {
      label: label,
      data: values,
      pointRadius: 0,
    };
    chart.config.data.datasets.push(dataset);
  });

  chart.update();
}

async function genPlot(cpmg_data) {
  const data = JSON.parse(cpmg_data);

  const qb1Chart = createChart("acquisitions1", "Qubit 1");
  const qb2Chart = createChart("acquisitions2", "Qubit 2");

  document.getElementById("note").textContent = JSON.stringify(
    data["vars"],
    undefined,
    4
  );

  addResetZoomEventListener(qb1Chart, "btnResetZoom1");
  addResetZoomEventListener(qb2Chart, "btnResetZoom2");

  updateChart(qb1Chart, data["time"], data["data"]["qb1"]);
  updateChart(qb2Chart, data["time"], data["data"]["qb2"]);
}

export { genPlot };
