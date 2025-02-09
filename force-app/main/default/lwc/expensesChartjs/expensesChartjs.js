import { LightningElement, api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import getExpensesGroupByType from '@salesforce/apex/ExpenseController.getExpensesGroupByType'; // Apex method to get expenses grouped by type
/**
 * When using this component in an LWR site, please import the below custom implementation of 'loadScript' module
 * instead of the one from 'lightning/platformResourceLoader'
 *
 * import { loadScript } from 'c/resourceLoader';
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 */

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class ExpenseChartjs extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;
    @api startDate;
    @api endDate;

    config = {
        type: 'pie',
        
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    async renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        let data = {
            datasets: [
                {
                    data: [
                        // expense amount
                    ],
                    backgroundColor: [
                        // random color for each expense type
                    ],
                    label: 'Dataset 1'
                }
            ],
            labels: [
                // expense type
            ]
        };

        try {
            await loadScript(this, chartjs);
            
            // Call the Apex method to get the expenses grouped by type
            let result = await getExpensesGroupByType({startDate: this.startDate, endDate: this.endDate});
            
            // For each loop to populate the data object and assign a random color to each type of expense
            result.array.forEach(item => {
                data.datasets[0].data.push(item.totalAmount); // expense amount 
                data.labels.push(item.Expense_Type__c); // expense type 
                data.datasets[0].backgroundColor.push(this.getRandomColor());  // random color
            });

            // Assign the data object to the config object and create the chart using Chart.js
            this.config.data = data;
            const canvas = document.createElement('canvas');
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        } catch (error) {
            this.error = error;
        }
    }

    // Method to generate a random color for each expense type
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
}
