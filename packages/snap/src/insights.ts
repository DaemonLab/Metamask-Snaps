export async function getInsights(transaction: Record<string, unknown>, res: string, spam: string, fee: string, transacts: string) {
    try {     
      return {
        "Your ID": `${transaction.from}`,
        "Recievers ID":`${transaction.to}`,
        "Is it SPAM": `${spam}`,
        "Recievers Balance Warning": `${res}`,
        "Gas fee": `${fee}`,
        "Has Transaction": `${transacts}`,
      };
    } catch (error) {
      console.error(error);
      return {
        type: 'Unknown transaction',
      };
    }
  }
  
    