import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin);

(async function () {
    var data = JSON.parse(cpmg_data);



    var qb1Chart = new Chart(
        document.getElementById('acquisitions1'),
        {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'signal (V)'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'time (ns)'
                      }
                    },
                  },
                plugins: {
                    title: {
                        display: true,
                        text: 'Qubit 1'
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                            modifierKey: 'alt',
                        },
                        zoom: {
                            drag: {
                                enabled: true
                            },
                            mode: 'x',
                        },
                    }
                }
            },
        },
    );

    document.getElementById('note').textContent = JSON.stringify(data['vars'], undefined, 4)

    document.getElementById('btnResetZoom1').addEventListener('click', function () {
        qb1Chart.resetZoom();
    });

    document.getElementById('btnResetZoom2').addEventListener('click', function () {
        qb2Chart.resetZoom();
    });

    var qb2Chart = new Chart(
        document.getElementById('acquisitions2'),
        {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'signal (V)'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'time (ns)'
                      }
                    },
                  },
                plugins: {
                    title: {
                        display: true,
                        text: 'Qubit 2'
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                            modifierKey: 'alt',
                        },
                        zoom: {
                            drag: {
                                enabled: true
                            },
                            mode: 'x',
                        },
                    }
                }
            }
        }
    );

    qb1Chart.config.data.labels = data["time"]
    qb2Chart.config.data.labels = data["time"]

    var qb1Dataset = {
        label: 'I',
        data: [],
        pointRadius: 0
    };
    for (value in data["data"]['qb1'][0]) {
        qb1Dataset.data.push(data["data"]['qb1'][0][value]);
    }
    qb1Chart.config.data.datasets.push(qb1Dataset);

    var qb1Dataset = {
        label: 'Q',
        data: [],
        pointRadius: 0
    };
    for (value in data["data"]['qb1'][1]) {
        qb1Dataset.data.push(data["data"]['qb1'][1][value]);
    }
    qb1Chart.config.data.datasets.push(qb1Dataset);

    if (true) {
    // if ('qb2' in data) {
        var qb2Dataset = {
            label: 'I',
            data: [],
            pointRadius: 0
        };
        for (value in data["data"]['qb2'][0]) {
            qb2Dataset.data.push(data["data"]['qb2'][0][value]);
        }
        qb2Chart.config.data.datasets.push(qb2Dataset);

        var qb2Dataset = {
            label: 'Q',
            data: [],
            pointRadius: 0
        };
        for (value in data["data"]['qb2'][1]) {
            qb2Dataset.data.push(data["data"]['qb2'][1][value]);
        }
        qb2Chart.config.data.datasets.push(qb2Dataset);
    }

    qb1Chart.update();
    qb2Chart.update();
})();
