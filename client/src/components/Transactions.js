import Layout from "./Layout";
import TransactionsTable from "./TransactionsTable";

import { Row, Button, Text } from "@nextui-org/react";

import { isWalletConnected, connectWallet, checkIfTransactionExist } from "../shared/Transaction";

import { useGlobalState } from "../store";

import { useEffect } from "react";
const Transactions = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");

  useEffect(() => {
    isWalletConnected();
    checkIfTransactionExist();
  }, []);

  return (
    <Layout>
      {connectedAccount ? (
        <>
          <Text h4 css={{ padding: "1rem" }}>
            Your wallet address is:{" "}
            <Text b color="primary" css={{ wordWrap: "break-word" }}>
              {connectedAccount}
            </Text>
          </Text>
          <TransactionsTable />
        </>
      ) : (
        <Row justify="center" align="center" css={{ height: "90vh" }}>
          <Button color="gradient" size="xl" onPress={connectWallet}>
            Connect wallet
          </Button>
        </Row>
      )}
    </Layout>
  );
};

export default Transactions;
