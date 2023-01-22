export async function getInsights(transaction: Record<string, unknown>, data: any) {
    try {     
      return {
        "Your ID": `${transaction.from}`,
        "Recievers ID": `${transaction.to}`,
        "is it safe": `${data}`,
      };
    } catch (error) {
      console.error(error);
      return {
        type: 'Unknown transaction',
      };
    }
  }
  
  