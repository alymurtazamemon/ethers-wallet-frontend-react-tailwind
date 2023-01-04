import { ChangeEvent, FormEvent, useState } from "react";
import { ethers, ContractTransaction, BigNumber } from "ethers";
import { Loading, useNotification } from "@web3uikit/core";
import { AiFillBell } from "react-icons/ai";

import { contractAddresses, abi } from "../constants";
import GenericButton from "./GenericButton";
import GenericInputField from "./GenericInputField";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";

enum Action {
    None,
    Deposit,
    Withdraw,
    Transfer,
}

const { ethereum } = window as any;

interface contractAddressesInterface {
    [key: string]: string[];
}

interface Props {
    refetch: (
        variables?: Partial<OperationVariables> | undefined
    ) => Promise<ApolloQueryResult<any>>;
}

function Form({ refetch }: Props) {
    const dispatch = useNotification();

    // * state
    const [formData, setFormData] = useState({
        value: "",
        address: "",
    });
    const [action, setAction] = useState(Action.None);
    const [loading, setLoading] = useState(false);

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
            } catch (error: any) {
                setLoading(false);
                dispatch({
                    type: "error",
                    title: error.name,
                    message: error.message,
                    icon: <AiFillBell />,
                    position: "topR",
                });
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
            } catch (error: any) {
                setLoading(false);
                dispatch({
                    type: "error",
                    title: error.name,
                    message: error.message,
                    icon: <AiFillBell />,
                    position: "topR",
                });
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
            } catch (error: any) {
                setLoading(false);
                dispatch({
                    type: "error",
                    title: error.name,
                    message: error.message,
                    icon: <AiFillBell />,
                    position: "topR",
                });
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
            setLoading(true);
            try {
                provider.once(
                    transactionResponse.hash,
                    async (transactionReceipt: any) => {
                        console.log(
                            `Completed with ${transactionReceipt.confirmations} confirmations. `
                        );
                        resolve("success");
                        await refetch();
                        setLoading(false);
                        dispatch({
                            type: "success",
                            title: "Success",
                            message: "Transaction Completed.",
                            icon: <AiFillBell />,
                            position: "topR",
                        });
                    }
                );
            } catch (error: any) {
                reject(error);
                setLoading(false);
                dispatch({
                    type: "error",
                    title: error.name,
                    message: error.message,
                    icon: <AiFillBell />,
                    position: "topR",
                });
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
        <div>
            <form id="data-form" onSubmit={handleOnSubmit}>
                <div>
                    <GenericInputField
                        className=""
                        type="text"
                        name="value"
                        value={formData.value}
                        onChange={handleOnChange}
                        placeholder="value (ETH)"
                        required={
                            action.toString() === Action.Deposit.toString() ||
                            action.toString() === Action.Transfer.toString()
                        }
                    />
                    <GenericInputField
                        className="mt-4"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleOnChange}
                        placeholder="0xf39F......b92266"
                        required={
                            action.toString() === Action.Transfer.toString()
                        }
                    />
                    <p className="text-center text-sky-300 font-thin text-sm mt-4 mb-8">
                        NOTE: Address is only required for tranfer.
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <GenericButton
                        className="px-12 mx-2"
                        form="data-form"
                        text="Deposit"
                        onClick={() => {
                            setAction(Action.Deposit);
                        }}
                        isDisabled={loading}
                    />
                    <GenericButton
                        form="data-form"
                        text="Withdraw"
                        className="px-12 mx-2"
                        onClick={() => {
                            setAction(Action.Withdraw);
                        }}
                        isDisabled={loading}
                    />
                    <GenericButton
                        form="data-form"
                        text="Tranfer"
                        className="px-12 mx-2"
                        onClick={() => {
                            setAction(Action.Transfer);
                        }}
                        isDisabled={loading}
                    />
                </div>
            </form>
            <div className="flex justify-center items-center mt-4">
                {loading ? (
                    <Loading
                        fontSize={12}
                        size={12}
                        spinnerColor="#FFA500"
                        spinnerType="wave"
                        text="pending..."
                    />
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default Form;
