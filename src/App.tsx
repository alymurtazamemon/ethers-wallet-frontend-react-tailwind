import "./App.css";
import ConnectButton from "./components/ConnectButton";

function App() {
    return (
        <div className="">
            <div className="pt-4">
                <h1 className="text-sky-400 text-center font-black text-8xl">
                    Ethers Wallet
                </h1>
                <p className="text-center text-sky-300 font-thin text-xl pt-2">
                    A decentralized way to deposit, withdraw and transfer funds.
                </p>
            </div>
            <ConnectButton />
            <div className="flex justify-center mt-24">
                <input
                    className="w-1/3 px-4 py-3 text-sky-300 placeholder:text-sky-300 placeholder:italic bg-transparent border-2 border-sky-400 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    type="text"
                    placeholder="0.1 ether"
                />
            </div>
        </div>
    );
}

export default App;
