import { ApolloError } from "@apollo/client";
import { ethers } from "ethers";

interface Props {
    loading: boolean;
    error: ApolloError | undefined;
    data: any;
}

function Transactions({ loading, error, data }: Props) {
    if (loading) return <p className="text-white">Loading...</p>;
    if (error) return <p className="text-white">Error : {error.message}</p>;

    const { deposits, withdraws, transfers } = data;

    let arrayOfTxs = [...deposits, ...withdraws, ...transfers];
    arrayOfTxs = arrayOfTxs.sort((a, b) => b.timestamp - a.timestamp);

    const txs: any = arrayOfTxs.map((tx: any, index: number) => {
        const from =
            tx.__typename == "Deposit"
                ? tx.sender
                : tx.__typename == "Withdraw"
                ? tx.caller
                : tx.__typename == "Transfer"
                ? tx.from
                : "null";

        const value =
            tx.__typename == "Deposit" || tx.__typename == "Withdraw"
                ? tx.value
                : tx.amounts[0];

        return (
            <div key={index} className="text-sky-200 flex">
                <div className="mr-10 my-4">
                    <p>Type</p>
                    <p>From</p>
                    {tx.__typename == "Withdraw" ? <div></div> : <p>To</p>}
                    <p>Value</p>
                    <p>Timestamp</p>
                </div>
                <div className="w-full my-4">
                    <p>{tx.__typename}</p>
                    <p>
                        {from.slice(0, 6)}...$
                        {from.slice(from.length - 4)}
                    </p>
                    {tx.__typename == "Deposit" ? (
                        <p>
                            {tx.receiver.slice(0, 6)}...$
                            {tx.receiver.slice(tx.receiver.length - 4)}
                        </p>
                    ) : tx.__typename == "Withdraw" ? (
                        <div></div>
                    ) : tx.__typename == "Transfer" ? (
                        <p>
                            {tx.to[0].slice(0, 6)}...$
                            {tx.to[0].slice(tx.to[0].length - 4)}
                        </p>
                    ) : (
                        "null"
                    )}

                    <p>{ethers.utils.formatEther(value)} ETH</p>
                    <p>{timestampToDateAndTime(tx.timestamp)}</p>
                </div>
            </div>
        );
    });

    return txs;
}

function timestampToDateAndTime(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // January is 0
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedDate =
        year +
        "-" +
        (month < 10 ? `0${month}` : month) +
        "-" +
        (day < 10 ? `0${day}` : day);
    const formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedDate + " " + formattedTime; // Output: "2022-09-22 12:34:56"
}

export default Transactions;
