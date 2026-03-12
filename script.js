let config = null;
let currentRegion = 'east-africa';

// Load configuration
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading config:', error);
        document.getElementById('content').innerHTML = '<p>Error loading configuration</p>';
    }
}

function initializePage() {
    // Set forecast date
    const dateElement = document.getElementById('forecast-date');
    dateElement.textContent = `Released on ${config.lastUpdated} | Forecasts based on climate conditions through ${config.forecastPeriod}`;

    // Set contact info
    const contactElement = document.getElementById('contact-info');
    contactElement.innerHTML = `<a href="mailto:${config.contact.email1}">${config.contact.name1}</a> and <a href="mailto:${config.contact.email2}">${config.contact.name2}</a>`;

    // Set up tab event listeners
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const regionId = e.target.dataset.region;
            switchRegion(regionId);
        });
    });

    // Display initial region
    displayRegion(currentRegion);
}

function switchRegion(regionId) {
    currentRegion = regionId;

    // Update active tab
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.region === regionId) {
            btn.classList.add('active');
        }
    });

    // Display region content
    displayRegion(regionId);
}

function displayRegion(regionId) {
    const region = config.regions.find(r => r.id === regionId);
    if (!region) return;

    const contentDiv = document.getElementById('content');
    let html = '';

    // Region header
    html += `
        <div class="region-content active">
            <div class="region-header">
                <h2>${region.name}</h2>
                <div class="crop-info">
                    <span><strong>Crop:</strong> ${region.crop}</span>
                    <span><strong>Season:</strong> ${region.season}</span>
                    ${region.countries.length > 0 ? `<span><strong>Countries:</strong> ${region.countries.join(', ')}</span>` : ''}
                </div>
            </div>
    `;

    // Check if this is the "coming soon" region
    if (Object.keys(region.imagePaths).length === 0) {
        html += `
            <div class="coming-soon">
                <h3>🚀 Coming Soon</h3>
                <p>Maps and forecasts for ${region.name} will be available in future updates.</p>
            </div>
        `;
    } else {
        // Summary
        html += `<div class="summary">${region.summary}</div>`;

        // Caveats
        if (region.caveats.length > 0) {
            html += `
                <div class="caveats">
                    <h3>⚠️ Key Details and Caveats</h3>
                    <ul>
                        ${region.caveats.map(caveat => `<li>${caveat}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Figures
        html += `
            <div class="figures-section">
                <h3>Crop Yield Forecasts</h3>
                <div class="figure-grid">
        `;

        // Absolute yield forecast
        if (region.imagePaths.absolute) {
            html += createFigure(
                region.imageBase + region.imagePaths.absolute,
                'Absolute yield forecast (in mt/ha)',
                'Forecasts masked for data availability.'
            );
        }

        // Anomalies
        const anomalyLabels = {
            'anomaly2013': 'w.r.t 2013-2017 observed yield mean',
            'anomaly2018': 'w.r.t 2018-2022 observed yield mean',
            'anomaly10yr': 'w.r.t 10 years of historical yield forecasts'
        };

        for (const [key, label] of Object.entries(anomalyLabels)) {
            if (region.imagePaths[key]) {
                html += createFigure(
                    region.imageBase + region.imagePaths[key],
                    `% Anomaly ${label}`
                );
            }
        }

        // Skill evaluation
        if (region.imagePaths.skill) {
            html += createFigure(
                region.imageBase + region.imagePaths.skill,
                'Skill evaluation',
                'MAPE shown is the average of out-of-sample and in-sample MAPE for the last three months in the growing season'
            );
        }

        html += `</div></div>`;

        // Context section
        html += `
            <div class="figures-section">
                <h3>Context and Historical Data</h3>
                <div class="figure-grid">
        `;

        if (region.imagePaths.meanYield) {
            html += createFigure(
                region.imageBase + region.imagePaths.meanYield,
                `Mean ${region.crop} Yield`
            );
        }

        if (region.imagePaths.meanProduction) {
            html += createFigure(
                region.imageBase + region.imagePaths.meanProduction,
                `Mean ${region.crop} Production`
            );
        }

        if (region.imagePaths.observedYield) {
            html += createFigure(
                region.imageBase + region.imagePaths.observedYield,
                'Availability of observed yield data and choice of baselines'
            );
        }

        if (region.imagePaths.cropMask) {
            html += createFigure(
                region.imageBase + region.imagePaths.cropMask,
                '% Crop area'
            );
        }

        html += `</div></div>`;

        // Methods section (shown for all regions with data)
        html += getMethodsSection();
    }

    html += `</div>`;
    contentDiv.innerHTML = html;
}

function createFigure(imgUrl, title, caption = null) {
    return `
        <div class="figure-container">
            <img src="${imgUrl}" alt="${title}" loading="lazy" onerror="this.alt='Image failed to load: ${title}'">
            <figcaption>
                <strong>${title}</strong>
                ${caption ? `<br><em>${caption}</em>` : ''}
            </figcaption>
        </div>
    `;
}

function getMethodsSection() {
    return `
        <div class="methods-section">
            <h3>Methods and Context</h3>
            
            <div class="cape-framework">
                <h4>📊 CAPE Modeling Framework</h4>
                <p><strong>In-season Machine Learning (ML) based sub-national scale crop yield forecasts</strong></p>
                <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                    <em>Pre-season → Vegetative growth period → Reproductive development period → Harvest</em>
                </p>
                
                <h4 style="margin-top: 15px;">Standard Earth Observation (EO) Data Sets:</h4>
                <ul>
                    <li><strong>Precipitation</strong> – CHIRPS (UCSB)</li>
                    <li><strong>Reference ETo</strong> – NOAA-PSL</li>
                    <li><strong>NDVI</strong> – eMODIS (USGS/EROS)</li>
                    <li><strong>Temperature</strong> – NOAA-PSL</li>
                </ul>
                
                <p style="margin-top: 10px;">
                    <strong>7 Monthly EO Predictors:</strong> Precip, Dry days, ETo, Temp., GDD, KDD, NDVI 
                    <br><em>(Accumulated over time: e.g., Oct, Oct-Nov, Oct-Dec)</em>
                </p>
                
                <p style="margin-top: 10px;">
                    <strong>Model:</strong> XGBoost Regression Tree Model
                </p>
            </div>

            <h4 style="margin-top: 20px;">CAPE Model Predictors:</h4>
            <div class="predictors-grid">
                ${config.cape_predictors.map(predictor => `
                    <div class="predictor-card">
                        <span class="sign">${predictor.sign}</span>
                        <div class="name">${predictor.name}</div>
                        <div class="description">${predictor.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadConfig);
