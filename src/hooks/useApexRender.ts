import { useEffect } from 'react';
import { ApexOptions } from 'apexcharts';

const useApexRender = (states: any[] = []): void => {
  useEffect(() => {
    const charts = window.document?.querySelectorAll("div[type='apexChart']");
    if (charts.length > 0) {
      try {
        (async () => {
          const ApexCharts = await (await import('apexcharts')).default;
          charts.forEach((el) => {
            const dataOptions = el.getAttribute('data-options');
            if (dataOptions) {
              try {
                const parsedOptions = JSON.parse(dataOptions);
                const chart = new ApexCharts(el, parsedOptions);
                if (chart) {
                  chart.render();
                }
              } catch (error) {
                console.log(error);
              }
            }
          });
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }, states);
};

export default useApexRender;
