import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
    {
        deposits {
            id
            sender
            receiver
            timestamp
            value
        }
        withdraws {
            id
            caller
            value
            timestamp
        }
        transfers {
            from
            to
            timestamp
            amounts
        }
    }
`;
