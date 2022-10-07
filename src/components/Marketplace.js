import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";

import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Button, Grid, Text } from "@nextui-org/react";

import Layout from "./Layout";
import NFT from "./NFT";

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
        <Grid xs={12}>
          <Text h2 color="primary">
            NFT Market
          </Text>
        </Grid>
        {nfts &&
          nfts.map((nft, index) => (
            <Grid key={index}>
              {console.log(nft)}
              <NFT
                img={nft.image}
                name={nft.name}
                desc={nft.description}
                price={nft.price}
                button={
                  <Button onPress={() => buyNFT(nft)} css={{ width: "100%" }}>
                    Buy
                  </Button>
                }
              />
            </Grid>
          ))}
      </Grid.Container>
    </Layout>
  );
};

export default Marketplace;
