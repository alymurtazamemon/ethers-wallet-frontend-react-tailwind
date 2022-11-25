import "./App.css";
import ConnectButton from "./components/ConnectButton";
import GenericButton from "./components/GenericButton";
import { contractAddresses, abi } from "./constants";
import { ethers, ContractTransaction } from "ethers";

const { ethereum } = window as any;

interface contractAddressesInterface {
    [key: string]: string[];
}

function App(): JSX.Element {
    const addresses: contractAddressesInterface = contractAddresses;
    const chainId: string = parseInt(ethereum.chainId).toString();
    const contractAddress = chainId in addresses ? addresses[chainId][0] : null;

    async function onDepositTap() {
        if (typeof ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress!, abi, signer);
            try {
                const tx: ContractTransaction = await contract.deposit({
                    value: ethers.utils.parseEther("1"),
                });
                await listenForTransactionMine(tx, provider);
            } catch (error) {
                alert(
                    `Facing issue while depositing please check you are on the correct chain.`
                );
            }
        } else {
            alert(`We could not find the MetaMask extension in your browser.`);
        }
    }

    function listenForTransactionMine(
        transactionResponse: ContractTransaction,
        provider: any
    ) {
        console.log(`Mining ${transactionResponse.hash}`);
        return new Promise((resolve, reject) => {
            try {
                provider.once(
                    transactionResponse.hash,
                    (transactionReceipt: any) => {
                        console.log(
                            `Completed with ${transactionReceipt.confirmations} confirmations. `
                        );
                        resolve("success");
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

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
            <div className="flex justify-center mt-16">
                <GenericButton
                    text="Deposit"
                    onClick={onDepositTap}
                    className="mx-2 px-12"
                />
                <GenericButton
                    text="Withdraw"
                    onClick={() => console.log("withdraw")}
                    className="mx-2 px-12"
                />
                <GenericButton
                    text="Tranfer"
                    onClick={() => console.log("transfer")}
                    className="mx-2 px-12"
                />
            </div>
        </div>
    );
}

export default App;
