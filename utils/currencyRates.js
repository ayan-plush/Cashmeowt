const axios = require('axios');

const currencyRates = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get('https://data.fixer.io/api/latest', {
      params: {
        access_key: process.env.FIXER_API_KEY,
      },
    });

    const rates = response.data.rates;

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }

    const rate = rates[toCurrency] / rates[fromCurrency];
    return rate;

  } catch (err) {
    console.error('Exchange rate fetch error:', err.message);
    throw err;
  }
};

module.exports = { currencyRates };

