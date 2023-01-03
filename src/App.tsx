import "./App.css";

import ConnectButton from "./components/ConnectButton";
import Transactions from "./components/Transactions";
import Form from "./components/Form";

function App(): JSX.Element {
    return (
        <div>
            <div className="flex justify-between items-center mt-6">
                {/* this div is just for the alignment of other items. */}
                <div className="w-1/5"></div>
                <div>
                    <h1 className="text-sky-400 text-center font-black text-8xl">
                        Ethers Wallet
                    </h1>
                    <p className="text-center text-sky-300 font-thin text-xl mt-2">
                        A decentralized way to deposit, withdraw and transfer
                        funds.
                    </p>
                </div>
                <div className="w-1/5">
                    <ConnectButton />
                </div>
            </div>
            <div className="flex justify-between items-start mt-2">
                <div className="w-2/6">
                    <p className=" text-white text-center text-3xl font-bold">
                        Transactions
                    </p>
                    {/* className="overflow-auto h-[32rem]" */}
                    <div className="mt-4 px-8 overflow-auto scrollbar h-[32rem]">
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        {/* <Transactions /> */}
                        {/* <Transactions /> */}
                    </div>
                </div>
                <div className="mt-24">
                    <Form />
                </div>
                <div className="w-2/6"></div>
            </div>
        </div>
    );
}

export default App;
