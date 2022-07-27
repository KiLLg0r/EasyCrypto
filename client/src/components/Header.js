import { Button, Modal, Text, Input, Loading, Row, Spacer, Switch } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";

import { Link } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaEthereum } from "react-icons/fa";
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { BiX } from "react-icons/bi";

import { useGlobalState, setGlobalState } from "../store";
import { useState } from "react";
import { sendMoney } from "../shared/Transaction";

import "../styles/header.css";
import useWindowSize from "../utils/useWindowSize";

import { connectWallet } from "../shared/Transaction";

const Header = () => {
  const size = useWindowSize();

  const [modalVisible, setModalVisible] = useState(false);

  const mobileNav = size.width < 650;
  const [openNav, setOpenNav] = useState(false);

  const [connectedAccount] = useGlobalState("connectedAccount");
  const [balance] = useGlobalState("balance");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const darkMode = useDarkMode(false);

  const handleSubmit = () => {
    setLoading(true);

    sendMoney({ connectedAccount, address, amount, remark })
      .then(() => {
        setGlobalState("transaction", { address, amount, remark });
        setLoading(false);
        setModalVisible(false);
        resetForm();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const resetForm = () => {
    setAddress("");
    setAmount("");
    setRemark("");
  };

  return (
    <header className={`header ${openNav ? "open" : "closed"}`}>
      <div className="primaryNav">
        <div className="logo">
          <span className="accentLogoName">Easy</span>
          <span>Crypto</span>
        </div>
        <nav className="primaryLinks">
          <li>
            <Link className="nav-link" to="/">
              Transfers
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/marketplace">
              Marketplace
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/my-nfts">
              My NFTs
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/create-nft">
              Create NFT
            </Link>
          </li>
        </nav>
      </div>
      {mobileNav &&
        (!openNav ? (
          <GiHamburgerMenu className="hamburger" onClick={() => setOpenNav(true)} />
        ) : (
          <BiX className="hamburger" onClick={() => setOpenNav(false)} style={{ fontSize: "2rem" }} />
        ))}
      <nav className={`links ${mobileNav && "mobile"}`}>
        <li>
          <Row align="center">
            {mobileNav && (
              <>
                Dark mode <Spacer x={0.5} />
              </>
            )}
            <Switch
              checked={darkMode.value}
              onChange={() => darkMode.toggle()}
              iconOn={<BsMoonFill />}
              iconOff={<BsFillSunFill />}
            />
          </Row>
        </li>
        {connectedAccount && (
          <li>
            <Row align="center">
              {mobileNav && (
                <>
                  Balance <Spacer x={0.5} />
                </>
              )}
              <FaEthereum />
              <Spacer x={0.5} />
              {balance.slice(0, 10)} ETH
            </Row>
          </li>
        )}
        <li>
          <Button
            auto
            onPress={() => {
              if (connectedAccount) setModalVisible(true);
              else connectWallet();
            }}
          >
            New transfer
          </Button>
        </li>
      </nav>
      <Modal
        closeButton
        aria-labelledby="Transfer crypto"
        open={modalVisible}
        blur
        onClose={() => setModalVisible(false)}
      >
        <Modal.Header>
          <Text h3>Transfer crypto currency</Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            label="Address"
            required
            bordered
            placeholder="Wallet address"
            fullWidth
            onChange={(e) => setAddress(e.target.value)}
            clearable
          />
          <Input
            label="Amount"
            required
            bordered
            placeholder="Amount of ETH"
            onChange={(e) => setAmount(e.target.value)}
            clearable
            fullWidth
          />
          <Input
            label="Message"
            required
            bordered
            placeholder="The reason of transfer"
            fullWidth
            onChange={(e) => setRemark(e.target.value)}
            clearable
          />
        </Modal.Body>
        <Modal.Footer>
          {!loading ? (
            <Button onPress={handleSubmit} css={{ width: "100%" }}>
              Transfer
            </Button>
          ) : (
            <Button disabled css={{ width: "100%" }}>
              <Loading type="points" />
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;
