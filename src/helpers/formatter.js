
const currencyFormatter = (currency, text) => {
    let currencyFormat;
    const textFixed = text.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    switch (currency) {
        case 'GBP':
            currencyFormat = `£${textFixed}`
            break;
        case 'USD':
            currencyFormat = `$${textFixed}`
            break;
        case 'IDR':
            currencyFormat = `Rp${textFixed}`
            break;
    }

    return currencyFormat
}

export {currencyFormatter};