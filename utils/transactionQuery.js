class transactionQuery {

    transactions = []

    query = {}

    constructor(transactions,query){
        this.transactions = transactions
        this.query=query
    }

    flagQuery = () => {

        this.transactions = this.transactions.filter(c=>c.flag)

        return this
    }

    timeQuery = () => {

        const timestamp = Date.now();
        console.log(timestamp);
        const date = new Date(timestamp);
        const isoDate = date.toISOString();
        
        this.transactions = this.transactions.filter(c=>((isoDate-c.createdAt)/(1000 * 60 * 60))>2)

        return this
    }

}