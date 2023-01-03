import { ChangeEvent, FormEvent, useState } from "react";
import { ethers, ContractTransaction, BigNumber } from "ethers";

import "./App.css";

import { contractAddresses, abi } from "./constants";
import ConnectButton from "./components/ConnectButton";
import GenericButton from "./components/GenericButton";
import GenericInputField from "./components/GenericInputField";
import Transactions from "./components/Transactions";

const { ethereum } = window as any;

interface contractAddressesInterface {
    [key: string]: string[];
}

enum Action {
    None,
    Deposit,
    Withdraw,
    Transfer,
}

function App(): JSX.Element {
    // * state
    const [formData, setFormData] = useState({
        value: "",
        address: "",
    });
    const [action, setAction] = useState(Action.None);

    // * variables
    const addresses: contractAddressesInterface = contractAddresses;
    const chainId: string = parseInt(ethereum.chainId).toString();
    const contractAddress = chainId in addresses ? addresses[chainId][0] : null;
    // let action = Action.Withdraw;

    interface DepositFunctionNamedParameters {
        value: string;
    }

    async function deposit({ value }: DepositFunctionNamedParameters) {
        if (typeof ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress!, abi, signer);
            try {
                const tx: ContractTransaction = await contract.deposit({
                    value: ethers.utils.parseEther(value),
                });
                await listenForTransactionMine(tx, provider);
                setFormData({
                    value: "",
                    address: "",
                });
            } catch (error) {
                alert(error);
            }
        } else {
            alert(`We could not find the MetaMask extension in your browser.`);
        }
    }

    async function withdraw() {
        if (typeof ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress!, abi, signer);
            try {
                const tx: ContractTransaction = await contract.withdraw();
                await listenForTransactionMine(tx, provider);
            } catch (error) {
                alert(error);
            }
        } else {
            alert(`We could not find the MetaMask extension in your browser.`);
        }
    }

    interface TransferFunctionNamedParameters {
        receivers: string[];
        amounts: BigNumber[];
        value: BigNumber;
    }

    async function transfer({
        receivers,
        amounts,
        value,
    }: TransferFunctionNamedParameters) {
        if (typeof ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress!, abi, signer);
            try {
                const tx: ContractTransaction = await contract.transfer(
                    receivers,
                    amounts,
                    { value: value }
                );
                await listenForTransactionMine(tx, provider);
                setFormData({
                    value: "",
                    address: "",
                });
            } catch (error) {
                alert(error);
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

    function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        switch (action) {
            case 1:
                deposit({ value: formData.value });
                break;
            case 2:
                withdraw();
                break;
            case 3:
                transfer({
                    receivers: [formData.address],
                    amounts: [ethers.utils.parseEther(formData.value)],
                    value: ethers.utils.parseEther(sum([formData.value])),
                });
                break;
        }
    }

    function sum(amounts: string[]): string {
        return amounts.reduce((a, b) => Number(a) + Number(b), 0).toString();
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
            <div className="flex">
                <div>
                    <h1 className="mt-16 text-white text-center">
                        Transactions
                    </h1>
                    <div className="overflow-auto h-[32rem]">
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                        <Transactions />
                    </div>
                </div>
                <form id="data-form" onSubmit={handleOnSubmit}>
                    <div className="mt-24">
                        <GenericInputField
                            className="my-2"
                            type="text"
                            name="value"
                            value={formData.value}
                            onChange={handleOnChange}
                            placeholder="value (ETH)"
                            required={
                                action.toString() ===
                                    Action.Deposit.toString() ||
                                action.toString() === Action.Transfer.toString()
                            }
                        />
                        <GenericInputField
                            className="my-2"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleOnChange}
                            placeholder="0xf39F......b92266"
                            required={
                                action.toString() === Action.Transfer.toString()
                            }
                        />
                        <p className="text-center text-sky-300 font-thin text-sm pt-2">
                            NOTE: Address is only required for tranfer.
                        </p>
                    </div>
                    <div className="flex justify-center mt-16">
                        <GenericButton
                            className="mx-2 px-12"
                            form="data-form"
                            text="Deposit"
                            onClick={() => {
                                setAction(Action.Deposit);
                            }}
                        />
                        <GenericButton
                            form="data-form"
                            text="Withdraw"
                            className="mx-2 px-12"
                            onClick={() => {
                                setAction(Action.Withdraw);
                            }}
                        />
                        <GenericButton
                            form="data-form"
                            text="Tranfer"
                            className="mx-2 px-12"
                            onClick={() => {
                                setAction(Action.Transfer);
                            }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
