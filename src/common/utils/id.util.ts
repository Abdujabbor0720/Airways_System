export function generatePNR(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 6; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}
export function generateTicketNumber(prefix = ''): string {
    const base = Date.now().toString(36).toUpperCase();
    const rnd = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
    const prefixPart = prefix ? `${prefix}-` : '';
    return `${prefixPart}${base}${rnd}`;
}
