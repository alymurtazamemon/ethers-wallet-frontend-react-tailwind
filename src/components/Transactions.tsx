import { useQuery } from "@apollo/client";
import { GET_DEPOSITS_TRANSACTIONS } from "../constants/subgraphQueries";

function Transactions() {
    const { loading, error, data } = useQuery(GET_DEPOSITS_TRANSACTIONS);

    if (loading) return <p className="text-white">Loading...</p>;
    if (error) return <p className="text-white">Error : {error.message}</p>;

    const depositsTxsTile = data.deposits.map((tx: any) => (
        <div className="text-white flex">
            <div className="mr-4">
                <p>From</p>
                <p>To</p>
                {/* mistake from contract side. */}
                <p>Value</p>
                <p>Timestamp</p>
            </div>
            <div>
                <p>{tx.sender}</p>
                <p>{tx.receiver}</p>
                {/* mistake from contract side. */}
                <p>{tx.timestamp}</p>
                <p>{tx.value}</p>
            </div>
        </div>
    ));

    return <p className="text-white">{depositsTxsTile}</p>;
}

export default Transactions;
// id: "0xf3389b847b95af5099e48088c6530e04c8aedda80x2386f26fc10000";
// receiver: "0xf3389b847b95af5099e48088c6530e04c8aedda8";
// sender: "0x1ef4c1db7c299c9b5248da1ff8e4805fd6f4d4d1";
// timestamp: "10000000000000000";
// value: "1672491696";
// __typename: "Deposit";
