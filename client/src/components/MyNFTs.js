import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Col, Text, Card, Grid } from "@nextui-org/react";

import Layout from "./Layout";

const MyNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      }),
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <Layout>
        <h1>No NFTs owned</h1>
      </Layout>
    );
  return (
    <Layout>
      <Grid.Container>
        {nfts &&
          nfts.map((nft, index) => (
            <Grid key={index}>
              <Card css={{ height: "fit-content", minHeight: "450px", width: "300px" }}>
                <Card.Body>
                  <Col>
                    {console.log(nft)}
                    <img
                      src={nft.image}
                      alt="NFT placeholder"
                      width={300}
                      height={300}
                      style={{ objectFit: "cover", borderRadius: "0.625rem" }}
                    />
                    <Text h3>{nft.price} ETH</Text>
                  </Col>
                </Card.Body>
              </Card>
            </Grid>
          ))}
      </Grid.Container>
    </Layout>
  );
};

export default MyNFTs;
