export interface PIXData {
  qrCode: string;
  pixCode: string;
  expirationTime: string;
}

export function generatePIXCode(orderId: number, amount: number): string {
  // Mock PIX code generation
  // In a real implementation, this would integrate with a payment provider
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `00020126580014BR.GOV.BCB.PIX0136${orderId}-${timestamp}-${random}5204000053039865802BR5925TABUA DE MINAS COMERCIO6014BELO HORIZONTE62070503***6304${amount.toFixed(2).replace('.', '')}`;
}

export function generateQRCode(pixCode: string): string {
  // Mock QR code generation
  // In a real implementation, this would generate an actual QR code
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="160" height="160" fill="black"/>
      <rect x="30" y="30" width="140" height="140" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">QR Code</text>
      <text x="100" y="120" text-anchor="middle" font-size="8" fill="black">PIX Payment</text>
    </svg>
  `)}`;
}
