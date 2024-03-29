import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NotificationProvider } from "@web3uikit/core";

const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/33996/ethers-wallet/v0.0.2",
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <NotificationProvider>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </NotificationProvider>
    </React.StrictMode>
);
