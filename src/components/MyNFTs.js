import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Grid, Text, Button } from "@nextui-org/react";

import { useNavigate } from "react-router-dom";

import Layout from "./Layout";
import NFT from "./NFT";

const MyNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useNavigate();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
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
          name: meta.data.name,
          description: meta.data.description,
          tokenURI,
        };
        return item;
      }),
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  const listNFT = (nft) => {
    router(`../resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  };

  if (loadingState === "loaded" && !nfts.length)
    return (
      <Layout>
        <h1>No NFTs owned</h1>
      </Layout>
    );
  return (
    <Layout>
      <Grid.Container gap={2}>
        <Grid xs={12}>
          <Text h2 color="primary">
            My acquired NFTs
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
                  <Button onPress={() => listNFT(nft)} css={{ width: "100%" }}>
                    List
                  </Button>
                }
              />
            </Grid>
          ))}
      </Grid.Container>
    </Layout>
  );
};

export default MyNFTs;
