export const validateEmail = (email) => {
    if (typeof email !== 'string') return false;

    const trimmed = email.trim();

    if (trimmed.length === 0 || trimmed.length > 254) return false;

    const atIndex = trimmed.lastIndexOf('@');

    if (atIndex <= 0 || atIndex === trimmed.length - 1) {
        return false;
    }

    const localPart = trimmed.slice(0, atIndex);
    const domainPart = trimmed.slice(atIndex + 1);

    if (localPart.length === 0 || localPart.length > 64) {
        return false;
    }

    if (domainPart.length === 0 || domainPart.length > 253) {
        return false;
    }

    if (
        localPart.startsWith('.') ||
        localPart.endsWith('.') ||
        localPart.includes('..')
    ) {
        return false;
    }

    if (
        domainPart.startsWith('.') ||
        domainPart.endsWith('.') ||
        domainPart.startsWith('-') ||
        domainPart.endsWith('-') ||
        domainPart.includes('..') ||
        !domainPart.includes('.')
    ) {
        return false;
    }

    const domainLabels = domainPart.split('.');

    const labelRegex =
        /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

    for (const label of domainLabels) {
        if (!labelRegex.test(label)) {
            return false;
        }
    }

    const tld = domainLabels[domainLabels.length - 1];

    if (!/^[a-zA-Z]{2,}$/.test(tld)) {
        return false;
    }

    const unquotedLocalRegex =
        /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;

    const quotedLocalRegex = /^"(?:[^"\\]|\\.)*"$/;

    const isValidLocal =
        unquotedLocalRegex.test(localPart) ||
        quotedLocalRegex.test(localPart);

    if (!isValidLocal) {
        return false;
    }

    return true;
};