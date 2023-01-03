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
