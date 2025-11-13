// Personal Loan Calculator - JavaScript

class LoanCalculator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setInitialValues();
        // Ensure calculations run after a short delay to ensure DOM is fully loaded
        setTimeout(() => {
            this.calculateLoan();
        }, 100);
    }

    initializeElements() {
        // Input elements
        this.loanAmountInput = document.getElementById('loan-amount');
        this.interestRateInput = document.getElementById('interest-rate');
        this.loanTenureInput = document.getElementById('loan-tenure');
        
        // Check if elements were found
        if (!this.loanAmountInput || !this.interestRateInput || !this.loanTenureInput) {
            console.error('Input DOM elements not found!');
            return;
        }
        
        // Result elements
        this.emiAmount = document.getElementById('emi-amount');
        this.totalInterest = document.getElementById('total-interest');
        this.totalAmount = document.getElementById('total-amount');
        this.principalAmount = document.getElementById('principal-amount');
        this.loanTenureDisplay = document.getElementById('loan-tenure-display');
        
        // VOO Investment elements
        this.conservativeInvested = document.getElementById('conservative-invested');
        this.conservativePeriod = document.getElementById('conservative-period');
        this.conservativeProfit = document.getElementById('conservative-profit');
        this.conservativeLoanInterest = document.getElementById('conservative-loan-interest');
        this.conservativeNet = document.getElementById('conservative-net');
        this.historicalInvested = document.getElementById('historical-invested');
        this.historicalPeriod = document.getElementById('historical-period');
        this.historicalProfit = document.getElementById('historical-profit');
        this.historicalLoanInterest = document.getElementById('historical-loan-interest');
        this.historicalNet = document.getElementById('historical-net');
        this.optimisticInvested = document.getElementById('optimistic-invested');
        this.optimisticPeriod = document.getElementById('optimistic-period');
        this.optimisticProfit = document.getElementById('optimistic-profit');
        this.optimisticLoanInterest = document.getElementById('optimistic-loan-interest');
        this.optimisticNet = document.getElementById('optimistic-net');
        
        // Monthly comparison elements
        this.monthlyEMI = document.getElementById('monthly-emi');
        this.monthlyInvestmentProfit = document.getElementById('monthly-investment-profit');
        this.netMonthlyFlow = document.getElementById('net-monthly-flow');
        this.flowNote = document.getElementById('flow-note');
        this.conservativeMonthly = document.getElementById('conservative-monthly');
        this.historicalMonthly = document.getElementById('historical-monthly');
        this.optimisticMonthly = document.getElementById('optimistic-monthly');
        
        // Help section elements
        this.helpToggleBtn = document.getElementById('toggle-help');
        this.helpSection = document.getElementById('help-section');
        this.helpTabs = document.querySelectorAll('.help-tab');
        this.helpTabContents = document.querySelectorAll('.help-tab-content');
        
        // Detailed calculation elements
        this.toggleBtn = document.getElementById('toggle-calculations');
        this.detailedSection = document.getElementById('detailed-calculations');
        this.detailPrincipal = document.getElementById('detail-principal');
        this.detailTenure = document.getElementById('detail-tenure');
        this.detailLoanInterest = document.getElementById('detail-loan-interest');
        
        // Conservative calculation elements
        this.conservativeMonthlyRate = document.getElementById('conservative-monthly-rate');
        this.conservativeFutureValue = document.getElementById('conservative-future-value');
        this.conservativeTotalProfit = document.getElementById('conservative-total-profit');
        this.conservativeNetProfit = document.getElementById('conservative-net-profit');
        
        // Historical calculation elements
        this.historicalMonthlyRate = document.getElementById('historical-monthly-rate');
        this.historicalFutureValue = document.getElementById('historical-future-value');
        this.historicalTotalProfit = document.getElementById('historical-total-profit');
        this.historicalNetProfit = document.getElementById('historical-net-profit');
        
        // Optimistic calculation elements
        this.optimisticMonthlyRate = document.getElementById('optimistic-monthly-rate');
        this.optimisticFutureValue = document.getElementById('optimistic-future-value');
        this.optimisticTotalProfit = document.getElementById('optimistic-total-profit');
        this.optimisticNetProfit = document.getElementById('optimistic-net-profit');
        
        // Buttons
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        // Calculation detail modal elements
        this.calcModal = document.getElementById('calc-modal');
        this.calcModalClose = document.getElementById('calc-modal-close');
        this.calcModalBody = document.getElementById('calc-modal-body');
        this.calcDetailBtns = document.querySelectorAll('.calc-detail-btn');
    }

    setupEventListeners() {
        // Document-level input event listeners for better reliability
        document.addEventListener('input', (e) => {
            if (e.target.matches('#loan-amount, #interest-rate, #loan-tenure')) {
                this.calculateLoan();
            }
        });
        
        // Button events
        this.calculateBtn.addEventListener('click', () => {
            this.calculateLoan();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetForm();
        });
        
        // Help section toggle
        if (this.helpToggleBtn) {
            this.helpToggleBtn.addEventListener('click', () => {
                this.toggleHelpSection();
            });
        }
        
        // Help tab switching
        if (this.helpTabs.length > 0) {
            this.helpTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchHelpTab(tab);
                });
            });
        }
        
        // Detailed calculation toggle
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.toggleDetailedCalculations();
            });
        }
        
        // Calculation detail buttons
        this.calcDetailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const scenario = btn.getAttribute('data-scenario');
                this.showCalculationDetails(scenario);
            });
        });
        
        // Modal close functionality
        if (this.calcModalClose) {
            this.calcModalClose.addEventListener('click', () => {
                this.closeCalcModal();
            });
        }
        
        // Close modal when clicking outside
        if (this.calcModal) {
            this.calcModal.addEventListener('click', (e) => {
                if (e.target === this.calcModal) {
                    this.closeCalcModal();
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.calcModal && this.calcModal.classList.contains('show')) {
                this.closeCalcModal();
            }
        });
        
        // Real-time calculation on input
        this.loanAmountInput.addEventListener('input', () => this.calculateLoan());
        this.interestRateInput.addEventListener('input', () => this.calculateLoan());
        this.loanTenureInput.addEventListener('input', () => this.calculateLoan());
    }

    setInitialValues() {
        // Set default values
        this.loanAmountInput.value = '30000';
        this.interestRateInput.value = '3';
        this.loanTenureInput.value = '10';
    }

    calculateLoan() {
        // Get values and validate
        const loanAmount = parseFloat(this.loanAmountInput.value) || 0;
        const annualRate = parseFloat(this.interestRateInput.value) || 0;
        const tenureYears = parseFloat(this.loanTenureInput.value) || 0;
        
        // Use default values if inputs are invalid
        const validLoanAmount = loanAmount > 0 ? loanAmount : 30000;
        const validAnnualRate = annualRate > 0 ? annualRate : 3;
        const validTenureYears = tenureYears > 0 ? tenureYears : 10;
        
        // Convert annual rate to monthly rate and tenure to months
        const monthlyRate = (validAnnualRate / 100) / 12;
        const tenureMonths = validTenureYears * 12;
        
        // EMI Calculation Formula: EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
        let emi = 0;
        
        if (monthlyRate > 0) {
            const powerValue = Math.pow(1 + monthlyRate, tenureMonths);
            emi = (validLoanAmount * monthlyRate * powerValue) / (powerValue - 1);
        } else {
            emi = validLoanAmount / tenureMonths;
        }
        
        // Calculate total amount and interest
        const totalAmount = emi * tenureMonths;
        const totalInterest = totalAmount - validLoanAmount;
        
        // Display results using valid values
        this.displayResults(emi, totalInterest, totalAmount, validLoanAmount, validTenureYears);
    }

    displayResults(emi, totalInterest, totalAmount, principalAmount, tenureYears) {
        // Format currency
        this.emiAmount.textContent = this.formatCurrency(emi);
        this.totalInterest.textContent = this.formatCurrency(totalInterest);
        this.totalAmount.textContent = this.formatCurrency(totalAmount);
        this.principalAmount.textContent = this.formatCurrency(principalAmount);
        this.loanTenureDisplay.textContent = `${tenureYears} years`;
        
        // Calculate and display VOO investment scenarios
        this.calculateVOOInvestment(principalAmount, tenureYears, totalInterest, emi);
        
        // Add animation class for results
        this.addResultsAnimation();
    }

    calculateVOOInvestment(principalAmount, tenureYears, loanInterest, emi) {
        // Always calculate and update VOO investment, even with default values
        if (principalAmount <= 0) {
            principalAmount = 30000; // Use default value
        }
        if (tenureYears <= 0) {
            tenureYears = 10; // Use default value
        }
        
        // Investment scenarios based on VOO historical performance
        const scenarios = [
            { name: 'conservative', rate: 0.07, label: 'Conservative' },
            { name: 'historical', rate: 0.10, label: 'Historical Average' },
            { name: 'optimistic', rate: 0.15, label: 'Optimistic' }
        ];
        
        const monthlyData = {};
        
        scenarios.forEach(scenario => {
            const futureValue = this.calculateFutureValue(principalAmount, scenario.rate, tenureYears);
            const profit = futureValue - principalAmount;
            const difference = profit - loanInterest;
            const monthlyProfit = this.calculateMonthlyProfit(principalAmount, scenario.rate);
            const netMonthlyFlow = monthlyProfit - emi;
            
            // Store data for monthly comparison
            monthlyData[scenario.name] = {
                monthlyProfit: monthlyProfit,
                netMonthlyFlow: netMonthlyFlow
            };
            
            // Update DOM elements with robust error checking
            const investedElement = this[`${scenario.name}Invested`];
            const periodElement = this[`${scenario.name}Period`];
            const profitElement = this[`${scenario.name}Profit`];
            const loanInterestElement = this[`${scenario.name}LoanInterest`];
            const netElement = this[`${scenario.name}Net`];
            const monthlyElement = this[`${scenario.name}Monthly`];
            
            if (investedElement) {
                investedElement.textContent = this.formatCurrency(principalAmount);
            }
            if (periodElement) {
                periodElement.textContent = `${tenureYears} years`;
            }
            if (profitElement) {
                profitElement.textContent = this.formatCurrency(profit);
            }
            if (loanInterestElement) {
                loanInterestElement.textContent = this.formatCurrency(loanInterest);
            }
            if (netElement) {
                netElement.textContent = this.formatCurrency(Math.abs(difference));
                netElement.className = `metric-value difference ${difference >= 0 ? 'positive' : 'negative'}`;
            }
            if (monthlyElement) {
                monthlyElement.textContent = this.formatCurrency(netMonthlyFlow);
                monthlyElement.className = `scenario-monthly ${netMonthlyFlow >= 0 ? 'positive' : 'negative'}`;
            }
        });
        
        // Update monthly comparison display
        this.updateMonthlyComparison(emi, monthlyData);
    }

    calculateFutureValue(principal, annualRate, years) {
        // Compound interest formula with quarterly dividend reinvestment
        // VOO pays dividends quarterly, so we compound 4 times per year
        // Formula: FV = PV × (1 + rate/4)^(years × 4)
        const quarterlyRate = annualRate / 4; // Convert to quarterly rate
        const totalQuarters = years * 4; // Total number of quarters
        return principal * Math.pow(1 + quarterlyRate, totalQuarters);
    }

    clearVOOInvestment() {
        const elements = [
            'conservativeInvested', 'conservativePeriod', 'conservativeProfit', 'conservativeLoanInterest', 'conservativeNet',
            'historicalInvested', 'historicalPeriod', 'historicalProfit', 'historicalLoanInterest', 'historicalNet',
            'optimisticInvested', 'optimisticPeriod', 'optimisticProfit', 'optimisticLoanInterest', 'optimisticNet',
            'conservativeMonthly', 'historicalMonthly', 'optimisticMonthly'
        ];
        
        elements.forEach(elementName => {
            const element = this[elementName];
            if (element) {
                if (elementName.includes('Period')) {
                    element.textContent = '0 years';
                } else {
                    element.textContent = '$0';
                }
            }
        });
        
        // Clear monthly comparison
        if (this.monthlyEMI) this.monthlyEMI.textContent = '$0';
        if (this.monthlyInvestmentProfit) this.monthlyInvestmentProfit.textContent = '$0';
        if (this.netMonthlyFlow) this.netMonthlyFlow.textContent = '$0';
        if (this.flowNote) this.flowNote.textContent = 'Monthly profit after loan payment';
        
        // Clear detailed calculations
        const detailedElements = [
            'detailPrincipal', 'detailLoanInterest',
            'conservativeMonthlyRate', 'conservativeFutureValue', 'conservativeTotalProfit', 'conservativeNetProfit',
            'historicalMonthlyRate', 'historicalFutureValue', 'historicalTotalProfit', 'historicalNetProfit',
            'optimisticMonthlyRate', 'optimisticFutureValue', 'optimisticTotalProfit', 'optimisticNetProfit'
        ];
        
        detailedElements.forEach(elementName => {
            const element = this[elementName];
            if (element) element.textContent = '$0';
        });
        
        if (this.detailTenure) this.detailTenure.textContent = '0 years (0 months)';
    }

    toggleHelpSection() {
        const isVisible = this.helpSection && this.helpSection.style.display !== 'none';
        
        if (this.helpSection) {
            if (isVisible) {
                this.helpSection.style.display = 'none';
                this.helpToggleBtn.innerHTML = '<span class="toggle-icon">📚</span><span class="toggle-text">Help & Terms Dictionary</span>';
            } else {
                this.helpSection.style.display = 'block';
                this.helpToggleBtn.innerHTML = '<span class="toggle-icon">📚</span><span class="toggle-text">Hide Help & Terms</span>';
                
                // Reset to first tab if needed
                this.switchHelpTab(this.helpTabs[0]);
                
                // Smooth scroll to the help section
                setTimeout(() => {
                    this.helpSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
        }
    }

    switchHelpTab(activeTab) {
        // Remove active class from all tabs and contents
        this.helpTabs.forEach(tab => tab.classList.remove('active'));
        this.helpTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        activeTab.classList.add('active');
        const tabName = activeTab.getAttribute('data-tab');
        const correspondingContent = document.getElementById(`${tabName}-tab`);
        if (correspondingContent) {
            correspondingContent.classList.add('active');
        }
    }

    calculateMonthlyProfit(principalAmount, annualRate) {
        // Monthly profit = (Annual Rate / 12) × Current Investment Value
        // Using the principal amount as base for monthly calculation
        const monthlyRate = annualRate / 12;
        return principalAmount * monthlyRate;
    }

    updateMonthlyComparison(emi, monthlyData) {
        // Update main monthly comparison (using historical average as default)
        if (this.monthlyEMI) {
            this.monthlyEMI.textContent = this.formatCurrency(emi);
        }
        
        if (this.monthlyInvestmentProfit) {
            const historicalMonthlyProfit = monthlyData.historical?.monthlyProfit || 0;
            this.monthlyInvestmentProfit.textContent = this.formatCurrency(historicalMonthlyProfit);
        }
        
        if (this.netMonthlyFlow) {
            const historicalNetFlow = monthlyData.historical?.netMonthlyFlow || 0;
            this.netMonthlyFlow.textContent = this.formatCurrency(historicalNetFlow);
            this.netMonthlyFlow.className = `flow-amount ${historicalNetFlow >= 0 ? 'positive' : 'negative'}`;
        }
        
        if (this.flowNote) {
            const netFlow = monthlyData.historical?.netMonthlyFlow || 0;
            if (netFlow >= 0) {
                this.flowNote.textContent = 'Positive cash flow - Investment profit exceeds loan payment';
                this.flowNote.className = 'flow-note positive';
            } else {
                this.flowNote.textContent = 'Negative cash flow - Loan payment exceeds investment profit';
                this.flowNote.className = 'flow-note negative';
            }
        }
        
        // Update detailed calculations
        this.updateDetailedCalculations(emi, monthlyData);
    }

    toggleDetailedCalculations() {
        const isVisible = this.detailedSection && this.detailedSection.style.display !== 'none';
        
        if (this.detailedSection) {
            if (isVisible) {
                this.detailedSection.style.display = 'none';
                this.toggleBtn.innerHTML = '<span class="toggle-icon">📊</span><span class="toggle-text">Show Detailed Calculations</span>';
            } else {
                this.detailedSection.style.display = 'block';
                this.toggleBtn.innerHTML = '<span class="toggle-icon">📊</span><span class="toggle-text">Hide Detailed Calculations</span>';
                
                // Force recalculation to ensure detailed calculations are up to date
                this.calculateLoan();
                
                // Smooth scroll to the detailed section
                setTimeout(() => {
                    this.detailedSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
        }
    }

    showCalculationDetails(scenario) {
        // Get current values
        const loanAmount = parseFloat(this.loanAmountInput.value) || 25000;
        const tenureYears = parseFloat(this.loanTenureInput.value) || 5;
        const annualRate = parseFloat(this.interestRateInput.value) || 12.5;
        const tenureMonths = tenureYears * 12;
        const monthlyRate = (annualRate / 100) / 12;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        const totalInterest = (emi * tenureMonths) - loanAmount;
        
        // Scenario details
        const scenarioRates = {
            conservative: 0.07,
            historical: 0.10,
            optimistic: 0.15
        };
        
        const scenarioLabels = {
            conservative: 'Conservative',
            historical: 'Historical Average',
            optimistic: 'Optimistic'
        };
        
        const rate = scenarioRates[scenario];
        const label = scenarioLabels[scenario];
        
        // Calculate investment details
        const quarterlyRate = rate / 4;
        const totalQuarters = tenureYears * 4;
        const futureValue = this.calculateFutureValue(loanAmount, rate, tenureYears);
        const profit = futureValue - loanAmount;
        const monthlyProfit = this.calculateMonthlyProfit(loanAmount, rate);
        
        // Generate modal content
        const modalContent = this.generateCalculationModalContent(
            scenario, label, rate, loanAmount, tenureYears, 
            quarterlyRate, totalQuarters, futureValue, profit, 
            monthlyProfit, totalInterest
        );
        
        this.calcModalBody.innerHTML = modalContent;
        this.calcModal.classList.add('show');
    }

    generateCalculationModalContent(scenario, label, rate, principal, years, quarterlyRate, totalQuarters, futureValue, profit, monthlyProfit, loanInterest) {
        return `
            <div class="calc-step-item">
                <div class="calc-step-title">
                    <span class="step-number">1</span>
                    Investment Parameters
                </div>
                <div class="calc-step-content">
                    <div class="calc-formula">Principal Amount (P) = $${principal.toLocaleString()}</div>
                    <div class="calc-formula">Investment Period = ${years} years</div>
                    <div class="calc-formula">Annual Return Rate = ${(rate * 100).toFixed(1)}%</div>
                    <p class="calc-explanation-text">This is the amount you would invest in VOO ETF, matching your loan principal amount.</p>
                </div>
            </div>

            <div class="calc-step-item">
                <div class="calc-step-title">
                    <span class="step-number">2</span>
                    Quarterly Rate Calculation
                </div>
                <div class="calc-step-content">
                    <div class="calc-formula">Quarterly Rate = Annual Rate ÷ 4</div>
                    <div class="calc-formula">Quarterly Rate = ${(rate * 100).toFixed(1)}% ÷ 4</div>
                    <div class="calc-formula">Quarterly Rate = <span class="calc-value">${(quarterlyRate * 100).toFixed(4)}%</span></div>
                    <p class="calc-explanation-text">VOO ETF pays dividends quarterly, so we compound the returns 4 times per year.</p>
                </div>
            </div>

            <div class="calc-step-item">
                <div class="calc-step-title">
                    <span class="step-number">3</span>
                    Number of Quarters
                </div>
                <div class="calc-step-content">
                    <div class="calc-formula">Total Quarters = Years × 4</div>
                    <div class="calc-formula">Total Quarters = ${years} × 4</div>
                    <div class="calc-formula">Total Quarters = <span class="calc-value">${totalQuarters} quarters</span></div>
                    <p class="calc-explanation-text">This is the total number of compounding periods over ${years} years.</p>
                </div>
            </div>

            <div class="calc-step-item">
                <div class="calc-step-title">
                    <span class="step-number">4</span>
                    Future Value Calculation
                </div>
                <div class="calc-step-content">
                    <div class="calc-formula">Future Value = P × (1 + r)^n</div>
                    <div class="calc-formula">Future Value = $${principal.toLocaleString()} × (1 + ${(quarterlyRate * 100).toFixed(4)}%)^${totalQuarters}</div>
                    <div class="calc-formula">Future Value = $${principal.toLocaleString()} × ${(1 + quarterlyRate).toFixed(6)}^${totalQuarters}</div>
                    <div class="calc-formula">Future Value = <span class="calc-value">$${futureValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
                    <p class="calc-explanation-text">This is what your investment will be worth after ${years} years with quarterly compounding.</p>
                </div>
            </div>

            <div class="calc-step-item">
                <div class="calc-step-title">
                    <span class="step-number">5</span>
                    Total Profit Calculation
                </div>
                <div class="calc-step-content">
                    <div class="calc-formula">Total Profit = Future Value - Principal</div>
                    <div class="calc-formula">Total Profit = $${futureValue.toLocaleString(undefined, {maximumFractionDigits: 2})} - $${principal.toLocaleString()}</div>
                    <div class="calc-formula">Total Profit = <span class="calc-value">$${profit.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
                    <p class="calc-explanation-text">This is your gross profit before considering loan costs. A positive value means profit, negative means loss.</p>
                </div>
            </div>

            <div class="calc-step-item">
                <div class="calc-step-title">
                    <span class="step-number">6</span>
                    Monthly Investment Profit
                </div>
                <div class="calc-step-content">
                    <div class="calc-formula">Monthly Profit = Principal × (Annual Rate ÷ 12)</div>
                    <div class="calc-formula">Monthly Profit = $${principal.toLocaleString()} × (${(rate * 100).toFixed(1)}% ÷ 12)</div>
                    <div class="calc-formula">Monthly Profit = $${principal.toLocaleString()} × ${(rate / 12).toFixed(6)}</div>
                    <div class="calc-formula">Monthly Profit = <span class="calc-value">$${monthlyProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
                    <p class="calc-explanation-text">Estimated monthly profit from your VOO investment at ${(rate * 100).toFixed(1)}% annual return.</p>
                </div>
            </div>

            <div class="calc-result">
                <strong>Summary for ${label} Scenario (${(rate * 100).toFixed(1)}%):</strong><br>
                • Investment Period: ${years} years<br>
                • Future Value: $${futureValue.toLocaleString(undefined, {maximumFractionDigits: 2})}<br>
                • Total Profit: $${profit.toLocaleString(undefined, {maximumFractionDigits: 2})}<br>
                • Monthly Profit: $${monthlyProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}<br>
                • Net After Loan Costs: $${(profit - loanInterest).toLocaleString(undefined, {maximumFractionDigits: 2})}
            </div>
        `;
    }

    closeCalcModal() {
        if (this.calcModal) {
            this.calcModal.classList.remove('show');
        }
    }

    updateDetailedCalculations(emi, monthlyData) {
        // Update input parameters
        if (this.detailPrincipal) {
            const loanAmount = parseFloat(this.loanAmountInput.value) || 0;
            this.detailPrincipal.textContent = this.formatCurrency(loanAmount);
        }
        
        if (this.detailTenure) {
            const tenureYears = parseFloat(this.loanTenureInput.value) || 0;
            this.detailTenure.textContent = `${tenureYears} years (${tenureYears * 12} months)`;
        }
        
        if (this.detailLoanInterest) {
            const totalInterest = emi * (parseFloat(this.loanTenureInput.value) || 0) * 12 - (parseFloat(this.loanAmountInput.value) || 0);
            this.detailLoanInterest.textContent = this.formatCurrency(totalInterest);
        }
        
        // Update calculation steps for each scenario
        const scenarios = [
            { 
                name: 'conservative', 
                rate: 0.07,
                monthlyRate: 0.07 / 12,
                elements: {
                    monthlyRate: this.conservativeMonthlyRate,
                    futureValue: this.conservativeFutureValue,
                    totalProfit: this.conservativeTotalProfit,
                    netProfit: this.conservativeNetProfit
                }
            },
            { 
                name: 'historical', 
                rate: 0.10,
                monthlyRate: 0.10 / 12,
                elements: {
                    monthlyRate: this.historicalMonthlyRate,
                    futureValue: this.historicalFutureValue,
                    totalProfit: this.historicalTotalProfit,
                    netProfit: this.historicalNetProfit
                }
            },
            { 
                name: 'optimistic', 
                rate: 0.15,
                monthlyRate: 0.15 / 12,
                elements: {
                    monthlyRate: this.optimisticMonthlyRate,
                    futureValue: this.optimisticFutureValue,
                    totalProfit: this.optimisticTotalProfit,
                    netProfit: this.optimisticNetProfit
                }
            }
        ];
        
        const loanAmount = parseFloat(this.loanAmountInput.value) || 0;
        const tenureYears = parseFloat(this.loanTenureInput.value) || 0;
        const tenureMonths = tenureYears * 12;
        
        scenarios.forEach(scenario => {
            if (scenario.elements.monthlyRate) {
                scenario.elements.monthlyRate.textContent = `${(scenario.monthlyRate * 100).toFixed(4)}%`;
            }
            
            if (scenario.elements.futureValue) {
                const futureValue = this.calculateFutureValue(loanAmount, scenario.rate, tenureYears);
                scenario.elements.futureValue.textContent = this.formatCurrency(futureValue);
            }
            
            if (scenario.elements.totalProfit) {
                const futureValue = this.calculateFutureValue(loanAmount, scenario.rate, tenureYears);
                const totalProfit = futureValue - loanAmount;
                scenario.elements.totalProfit.textContent = this.formatCurrency(totalProfit);
            }
            
            if (scenario.elements.netProfit) {
                const futureValue = this.calculateFutureValue(loanAmount, scenario.rate, tenureYears);
                const totalProfit = futureValue - loanAmount;
                const totalInterest = emi * tenureMonths - loanAmount;
                const netProfit = totalProfit - totalInterest;
                scenario.elements.netProfit.textContent = this.formatCurrency(netProfit);
                scenario.elements.netProfit.className = `step-value ${netProfit >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    addResultsAnimation() {
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s`;
            }, 10);
        });
    }

    resetForm() {
        // Reset to default values
        this.setInitialValues();
        this.calculateLoan();
        
        // Close help section if it's open to keep UI clean
        if (this.helpSection && this.helpSection.style.display !== 'none') {
            this.toggleHelpSection();
        }
        
        // Smooth reset animation
        const calculatorCard = document.querySelector('.calculator-card');
        calculatorCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            calculatorCard.style.transform = 'scale(1)';
        }, 150);
    }

    // Method to validate and format input values
    validateInput(input, min, max, step) {
        let value = parseFloat(input.value) || 0;
        
        if (value < min) value = min;
        if (value > max) value = max;
        
        // Round to step
        if (step) {
            value = Math.round(value / step) * step;
        }
        
        input.value = value;
        return value;
    }
}

// Utility functions for additional features
class LoanUtils {
    static compareLoans(loans) {
        return loans.sort((a, b) => a.emi - b.emi);
    }
    
    static calculateBreakEvenPoint(principal, monthlyRate, monthlyPayment) {
        let remainingPrincipal = principal;
        let months = 0;
        
        while (remainingPrincipal > 0 && months < 1000) {
            const interestPayment = remainingPrincipal * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            
            if (principalPayment <= 0) break;
            
            remainingPrincipal -= principalPayment;
            months++;
        }
        
        return months;
    }
    
    static generateAmortizationSchedule(principal, annualRate, tenureYears) {
        const monthlyRate = (annualRate / 100) / 12;
        const tenureMonths = tenureYears * 12;
        
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                   (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        
        let remainingPrincipal = principal;
        const schedule = [];
        
        for (let month = 1; month <= tenureMonths; month++) {
            const interestPayment = remainingPrincipal * monthlyRate;
            const principalPayment = emi - interestPayment;
            
            remainingPrincipal -= principalPayment;
            
            schedule.push({
                month,
                emi: emi,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                remainingPrincipal: Math.max(0, remainingPrincipal)
            });
        }
        
        return schedule;
    }
}

// Event listeners for enhanced functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the calculator
    const calculator = new LoanCalculator();
    
    // Add keyboard navigation support
    const inputs = document.querySelectorAll('.text-input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculator.calculateLoan();
            }
        });
    });
    
    // Add input formatting for better UX
    const numberInputs = document.querySelectorAll('.text-input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            // Format number on blur
            if (e.target.value && !isNaN(e.target.value)) {
                const value = parseFloat(e.target.value);
                if (input.id === 'loan-amount') {
                    e.target.value = Math.round(value / 100) * 100;
                } else if (input.id === 'interest-rate') {
                    e.target.value = Number(value).toFixed(1);
                } else if (input.id === 'loan-tenure') {
                    e.target.value = Number(value).toFixed(1);
                }
            }
        });
    });
});

// Export for potential external use
window.LoanCalculator = LoanCalculator;
window.LoanUtils = LoanUtils;