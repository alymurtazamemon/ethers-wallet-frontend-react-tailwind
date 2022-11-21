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
        </div>
    );
}

export default App;
