import "./App.css";
import ConnectButton from "./components/ConnectButton";
import GenericButton from "./components/GenericButton";
import { contractAddresses, abi } from "./constants";
import { ethers, ContractTransaction } from "ethers";
import GenericInputField from "./components/GenericInputField";
import { ChangeEvent, useState } from "react";

const { ethereum } = window as any;

interface contractAddressesInterface {
    [key: string]: string[];
}

function App(): JSX.Element {
    // * state
    const [formData, setFormData] = useState({
        value: "",
        address: "",
    });

    // * variables
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

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
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
            <form
            // onSubmit={(event) => {
            //     event.preventDefault();
            //     console.log("submit");
            // }}
            >
                <div className="mt-24">
                    <GenericInputField
                        className="mb-4"
                        type="text"
                        name="value"
                        value={formData.value}
                        onChange={handleOnChange}
                        placeholder="value (ETH)"
                    />
                    <GenericInputField
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleOnChange}
                        placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                    />
                    <p className="text-center text-sky-300 font-thin text-sm pt-2">
                        NOTE: Address is only required for tranfer.
                    </p>
                </div>
                <div className="flex justify-center mt-16">
                    <GenericButton
                        text="Deposit"
                        onClick={() => console.log("deposit")}
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
            </form>
        </div>
    );
}

export default App;
