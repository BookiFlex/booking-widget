export function formatMoney (money = 0, currency = 'USD') {
    return new Intl.NumberFormat(window.navigator.language, { style: 'currency', currency }).formatToParts(money);
}

export function htmlFormatMoney (money = 0, currency = 'USD', className = '', showFraction = true) {
    const parts = formatMoney(money, currency);
    let result = '';

    parts.forEach((part) => {
        if (part.type === 'currency') {
            result += `<span class="${className}">${part.value}</span>`;
        }

        if (part.type === 'literal') {
            result += `${part.value}`;
        }

        if (part.type === 'integer') {
            result += `${part.value}`;
        }

        if (showFraction && part.type === 'decimal') {
            result += `${part.value}`;
        }

        if (showFraction && part.type === 'fraction') {
            result += `${part.value}`;
        }
    });

    return result;
}

export function discountCalculator (current, old) {
    return Math.round((old - current) / (old / 100));
}