import { Table, Text, Row, Button, Spacer } from "@nextui-org/react";

import { FaEthereum } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

import { useEffect, useState } from "react";
import { getAllTransactions } from "../shared/Transaction";
import { useGlobalState } from "../store";

const TransactionsTable = () => {
  const [transactionsList] = useGlobalState("transaction");
  const [transactionsNumber] = useGlobalState("transactionCount");

  const [transactions, setTransactions] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(4);
  const [loading, setLoading] = useState(false);

  const shortenWalletAddress = (address) => `${address.slice(0, 4)}...${address.slice(address.length - 4)}`;

  const loadMoreTransactions = () => {
    setTransactions((prevTransactions) => [...prevTransactions, ...transactionsList.slice(start, end)]);
    setStart(end);
    setEnd(end * 2);
  };

  useEffect(() => {
    setLoading(true);

    getAllTransactions().then((response) => {
      setTransactions([...response.slice(start, end)]);
      setStart(end);
      setEnd(end * 2);
      setLoading(false);
    });

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Text h3 css={{ padding: "1rem" }}>
        Total transactions {transactionsNumber}
      </Text>
      <Table
        aria-label="Transactions"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <Table.Header>
          <Table.Column>SENDER</Table.Column>
          <Table.Column>RECEIVER</Table.Column>
          <Table.Column>AMOUNT</Table.Column>
          <Table.Column>TIMESTAMP</Table.Column>
          <Table.Column>MESSAGE</Table.Column>
        </Table.Header>
        <Table.Body>
          {transactions &&
            transactions.map((transaction, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Row align="center">
                    {shortenWalletAddress(transaction.sender)}
                    <Spacer x={0.5} />
                    <MdContentCopy
                      onClick={() => navigator.clipboard.writeText(transaction.sender)}
                      title="Copy"
                      style={{ cursor: "pointer" }}
                    />
                  </Row>
                </Table.Cell>
                <Table.Cell>
                  <Row align="center">
                    {shortenWalletAddress(transaction.receiver)}
                    <Spacer x={0.5} />
                    <MdContentCopy
                      onClick={() => navigator.clipboard.writeText(transaction.receiver)}
                      title="Copy"
                      style={{ cursor: "pointer" }}
                    />
                  </Row>
                </Table.Cell>
                <Table.Cell>
                  <Row align="center">
                    <FaEthereum />
                    <Spacer x={0.5} />
                    <span style={{ color: "var(--nextui-colors-green600)" }}>{transaction.amount}</span>
                  </Row>
                </Table.Cell>
                <Table.Cell>{transaction.timestamp}</Table.Cell>
                <Table.Cell>{transaction.remark}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {transactionsNumber > transactions.length && !loading && (
        <Row justify="center" css={{ marginTop: "1rem" }}>
          <Button onPress={loadMoreTransactions}>Load more transactions</Button>
        </Row>
      )}
    </>
  );
};

export default TransactionsTable;
