const { currencyRates } = require("../utils/currencyRates");

module.exports.convertToUSD = async (req, res, next) => {
    const {amount, currency} = req.body;

    if(!amount || !currency || currency.toLowerCase() === 'usd') return next();

    try {
    const rate = await currencyRates(currency.toUpperCase(), 'USD');
    req.body.originalAmount = amount;
    req.body.originalCurrency = currency.toLowerCase();
    req.body.amount = parseFloat((amount * rate).toFixed(2));
    req.body.currency = 'usd';

    next();
  } catch (err) {
    console.error('Currency middleware failed:', err.message);
    res.status(400).json({ error: 'Failed to convert currency to USD' });
  }

}
