import { useState, useEffect } from "react";
import GenericButton from "./GenericButton";

function ConnectButton(): JSX.Element {
    const [accountAddress, setAccountAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const { ethereum } = window as any;

    async function onConnectTap() {
        if (ethereum != "undefined") {
            try {
                await ethereum.request({
                    method: "eth_requestAccounts",
                });
            } catch (error) {
                console.log(error);
            }

            updateButton();
        } else {
            alert(`We could not find the MetaMask extension in your browser.`);
        }
    }

    async function updateButton() {
        if (ethereum.isConnected()) {
            const accounts = await ethereum.request({
                method: "eth_accounts",
            });

            const account = accounts[0];
            setAccountAddress(
                `Connected to ${account.slice(0, 6)}...${account.slice(
                    account.length - 4
                )}`
            );
            setIsConnected(true);
        }
    }

    useEffect(() => {
        const initialLoading = async () => {
            if (ethereum.isConnected()) {
                updateButton();
            }
        };

        initialLoading();

        ethereum.on("accountsChanged", (accounts: Array<string>) => {
            console.log(`Account changed to ${accounts[0]}`);
            if (accounts[0] == null) {
                setIsConnected(false);
            } else {
                updateButton();
            }
        });

        return () => {
            ethereum.removeListener("accountsChanged", () => {});
        };
    }, []);

    return (
        <GenericButton
            onClick={onConnectTap}
            isDisabled={isConnected}
            text={isConnected ? accountAddress : "Connect Wallet"}
        />
    );
}

export default ConnectButton;
