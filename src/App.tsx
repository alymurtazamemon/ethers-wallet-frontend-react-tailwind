import "./App.css";

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
            <div>
                <button className="text-sky-400 border-2 border-sky-400 px-4 py-2 rounded-full hover:bg-sky-800">
                    Connect Wallet
                </button>
            </div>
        </div>
    );
}

export default App;
