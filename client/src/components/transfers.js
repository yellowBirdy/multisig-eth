import React from "react";


 const Transfers = ({transfers}) => {
    return (
        <table>
        <thead>
            <tr>
                <th>id</th><th>Amount</th><th>Recipient</th><th>Approvals</th><th>Sent</th>
            </tr>
        </thead>
        <tbody>
            {transfers &&
            transfers.map(ts => 
                <tr key={ts.id}>
                    <td>{ts.id}</td>
                    <td>{ts.amount}</td>
                    <td>{ts.to}</td>
                    <td>{ts.approvals}</td>
                    <td>{ts.sent ? "yes" : "no"}</td>
                </tr>
            )}
        </tbody>
        </table>
    )
}

export default Transfers;
