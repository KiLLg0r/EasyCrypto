import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";

import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Button, Card, Grid, Col, Text } from "@nextui-org/react";

import Layout from "./Layout";

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/baeeuAof58NPLt07dSlMK77X5LteKwG6",
    );
    const contract = new ethers.Contract(nftContractAddress, nftContractAbi, provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return item;
      }),
    );

    setNfts(items);
    setLoadingState("loaded");
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  };

  if (loadingState === "loaded" && !nfts.length)
    return (
      <Layout>
        <h1 className="">No items in marketplace</h1>
      </Layout>
    );

  return (
    <Layout>
      <Grid.Container gap={2}>
        {nfts &&
          nfts.map((nft, index) => (
            <Grid key={index}>
              <Card css={{ height: "fit-content", minHeight: "450px", width: "300px" }}>
                <Card.Body>
                  {console.log(nft)}
                  <Col>
                    <img
                      src={nft.image}
                      alt="NFT placeholder"
                      width={300}
                      height={300}
                      style={{ objectFit: "cover", borderRadius: "0.625rem" }}
                    />
                    <Text h4>{nft.name}</Text>
                    <Text p css={{ overflow: "hidden", height: "2rem" }}>
                      {nft.description}
                    </Text>
                    <Text h3>{nft.price} ETH</Text>
                  </Col>
                </Card.Body>
                <Card.Footer>
                  <Button onPress={() => buyNFT(nft)} css={{ width: "100%" }}>
                    Buy
                  </Button>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
      </Grid.Container>
    </Layout>
  );
};

export default Marketplace;
