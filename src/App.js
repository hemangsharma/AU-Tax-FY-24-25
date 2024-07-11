import React, { useState } from 'react';
import './App.css';
import githubLogo from './github-logo.png'; // Import the GitHub logo

function App() {
    const [income, setIncome] = useState('');
    const [writeOffs, setWriteOffs] = useState('');
    const [taxBreakdownOld, setTaxBreakdownOld] = useState(null);
    const [taxBreakdownNew, setTaxBreakdownNew] = useState(null);

    const calculateTax = (income, writeOffs, thresholds, rates) => {
        const taxableIncome = income - writeOffs;
        let tax = 0;
        let breakdown = [];

        if (taxableIncome <= thresholds[0]) {
            tax = 0;
        } else if (taxableIncome <= thresholds[1]) {
            tax = (taxableIncome - thresholds[0]) * rates[0];
            breakdown.push({ range: `$${thresholds[0]} - $${taxableIncome}`, rate: rates[0] * 100, tax });
        } else if (taxableIncome <= thresholds[2]) {
            tax = (thresholds[1] - thresholds[0]) * rates[0] + (taxableIncome - thresholds[1]) * rates[1];
            breakdown.push({ range: `$${thresholds[0]} - $${thresholds[1]}`, rate: rates[0] * 100, tax: (thresholds[1] - thresholds[0]) * rates[0] });
            breakdown.push({ range: `$${thresholds[1]} - $${taxableIncome}`, rate: rates[1] * 100, tax: (taxableIncome - thresholds[1]) * rates[1] });
        } else if (taxableIncome <= thresholds[3]) {
            tax = (thresholds[1] - thresholds[0]) * rates[0] + (thresholds[2] - thresholds[1]) * rates[1] + (taxableIncome - thresholds[2]) * rates[2];
            breakdown.push({ range: `$${thresholds[0]} - $${thresholds[1]}`, rate: rates[0] * 100, tax: (thresholds[1] - thresholds[0]) * rates[0] });
            breakdown.push({ range: `$${thresholds[1]} - $${thresholds[2]}`, rate: rates[1] * 100, tax: (thresholds[2] - thresholds[1]) * rates[1] });
            breakdown.push({ range: `$${thresholds[2]} - $${taxableIncome}`, rate: rates[2] * 100, tax: (taxableIncome - thresholds[2]) * rates[2] });
        } else if (taxableIncome <= thresholds[4]) {
            tax = (thresholds[1] - thresholds[0]) * rates[0] + (thresholds[2] - thresholds[1]) * rates[1] + (thresholds[3] - thresholds[2]) * rates[2] + (taxableIncome - thresholds[3]) * rates[3];
            breakdown.push({ range: `$${thresholds[0]} - $${thresholds[1]}`, rate: rates[0] * 100, tax: (thresholds[1] - thresholds[0]) * rates[0] });
            breakdown.push({ range: `$${thresholds[1]} - $${thresholds[2]}`, rate: rates[1] * 100, tax: (thresholds[2] - thresholds[1]) * rates[1] });
            breakdown.push({ range: `$${thresholds[2]} - $${thresholds[3]}`, rate: rates[2] * 100, tax: (thresholds[3] - thresholds[2]) * rates[2] });
            breakdown.push({ range: `$${thresholds[3]} - $${taxableIncome}`, rate: rates[3] * 100, tax: (taxableIncome - thresholds[3]) * rates[3] });
        } else {
            tax = (thresholds[1] - thresholds[0]) * rates[0] + (thresholds[2] - thresholds[1]) * rates[1] + (thresholds[3] - thresholds[2]) * rates[2] + (thresholds[4] - thresholds[3]) * rates[3] + (taxableIncome - thresholds[4]) * rates[4];
            breakdown.push({ range: `$${thresholds[0]} - $${thresholds[1]}`, rate: rates[0] * 100, tax: (thresholds[1] - thresholds[0]) * rates[0] });
            breakdown.push({ range: `$${thresholds[1]} - $${thresholds[2]}`, rate: rates[1] * 100, tax: (thresholds[2] - thresholds[1]) * rates[1] });
            breakdown.push({ range: `$${thresholds[2]} - $${thresholds[3]}`, rate: rates[2] * 100, tax: (thresholds[3] - thresholds[2]) * rates[2] });
            breakdown.push({ range: `$${thresholds[3]} - $${thresholds[4]}`, rate: rates[3] * 100, tax: (thresholds[4] - thresholds[3]) * rates[3] });
            breakdown.push({ range: `$${thresholds[4]} - $${taxableIncome}`, rate: rates[4] * 100, tax: (taxableIncome - thresholds[4]) * rates[4] });
        }
        return { tax, breakdown };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const oldThresholds = [18200, 45000, 120000, 180000, Infinity];
        const oldRates = [0.19, 0.325, 0.37, 0.45];
        const newThresholds = [18200, 45000, 135000, 190000, Infinity];
        const newRates = [0.16, 0.30, 0.37, 0.45];

        const oldTaxData = calculateTax(income, writeOffs, oldThresholds, oldRates);
        const newTaxData = calculateTax(income, writeOffs, newThresholds, newRates);

        setTaxBreakdownOld(oldTaxData);
        setTaxBreakdownNew(newTaxData);
    };

    return (
        <div className="container">
            <h1>Australian Tax Calculator</h1>
            <h2>FY 24 - 25</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="income">Total Income:</label>
                <input
                    type="number"
                    id="income"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                />

                <label htmlFor="writeOffs">Write-offs:</label>
                <input
                    type="number"
                    id="writeOffs"
                    value={writeOffs}
                    onChange={(e) => setWriteOffs(e.target.value)}
                    required
                />

                <button type="submit">Calculate Tax</button>
            </form>
            {taxBreakdownOld && taxBreakdownNew && (
                <div className="results">
                    <h2>Comparison</h2>
                    <div className="result">
                        <div className="oldTax">
                            <h3>2023–24 settings</h3>
                            <p>Estimated annual tax liability: ${taxBreakdownOld.tax.toFixed(2)}</p>
                            <ul>
                                {taxBreakdownOld.breakdown.map((item, index) => (
                                    <li key={index}>
                                        {item.range} at {item.rate}%: ${item.tax.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="newTax">
                            <h3>Under new tax cuts</h3>
                            <p>Estimated annual tax liability: ${taxBreakdownNew.tax.toFixed(2)}</p>
                            <ul>
                                {taxBreakdownNew.breakdown.map((item, index) => (
                                    <li key={index}>
                                        {item.range} at {item.rate}%: ${item.tax.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <footer>
                <a href="https://github.com/hemangsharma" target="_blank" rel="noopener noreferrer">
                    <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
                </a>
            </footer>
        </div>
    );
}

export default App;
