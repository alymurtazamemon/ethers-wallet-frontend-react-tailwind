import { gql } from "@apollo/client";

export const GET_DEPOSITS_TRANSACTIONS = gql`
    {
        deposits {
            id
            sender
            receiver
            timestamp
            value
        }
    }
`;

export const GET_WITHDRAWS_TRANSACTIONS = gql`
    {
        withdraws {
            id
            caller
            value
            timestamp
        }
    }
`;

export const GET_TRANSFERS_TRANSACTIONS = gql`
    {
        transfers {
            from
            to
            timestamp
            amounts
        }
    }
`;
