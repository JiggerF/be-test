
export function isValidAmount(amount: number): boolean {
    return Number.isFinite(amount) && amount >= 0 ;    
}