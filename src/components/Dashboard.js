import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Grid, Text } from "@nextui-org/react";

import Layout from "./Layout";
import NFT from "./NFT";

const Dashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);
    const data = await contract.fetchItemsListed();

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

  if (loadingState === "loaded" && !nfts.length)
    return (
      <Layout>
        <h1>No NFTs listed</h1>
      </Layout>
    );

  return (
    <Layout>
      <Grid.Container gap={2}>
        <Grid xs={12}>
          <Text h2 color="primary">
            My listed NFTs
          </Text>
        </Grid>

        {nfts &&
          nfts.map((nft, index) => (
            <Grid key={index}>
              {console.log(nft)}
              <NFT img={nft.image} name={nft.name} desc={nft.description} price={nft.price} />
            </Grid>
          ))}
      </Grid.Container>
    </Layout>
  );
};

export default Dashboard;
