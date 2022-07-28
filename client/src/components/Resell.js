import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Grid, Text, Input, Textarea, Spacer, Button } from "@nextui-org/react";

import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

import { useSearchParams } from "react-router-dom";

const Resell = () => {
  const [price, updatePrice] = useState("");

  const [queryParams] = useSearchParams();
  const router = useNavigate();

  const id = queryParams.get("id");
  const tokenURI = queryParams.get("tokenURI");

  const [NFTData, updateNFTData] = useState({
    name: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchNFT = async () => {
      if (!tokenURI) return;
      const meta = await axios.get(tokenURI);

      updateNFTData((prev) => ({
        ...prev,
        name: meta.data.name,
        image: meta.data.image,
        description: meta.data.description,
      }));
    };
    fetchNFT();
  }, [tokenURI]);

  const listNFTForSale = async () => {
    if (!price) return;

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(price, "ether");
    let contract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();

    let transaction = await contract.resellItem(id, priceFormatted, { value: listingPrice });

    await transaction.wait();

    router("../dashboard");
  };

  return (
    <Layout>
      <Grid.Container gap={1}>
        <Grid xs={12}>
          <Text h2 color="primary">
            List your NFT
          </Text>
        </Grid>
        <Grid xs={12} sm={4}>
          <img
            src={NFTData.image}
            alt="NFT placeholder"
            width={300}
            height={300}
            style={{ objectFit: "cover", borderRadius: "0.625rem", display: "block", marginInline: "auto" }}
          />
        </Grid>
        <Grid xs={12} sm={8}>
          <Grid.Container>
            <Grid xs={12}>
              <Input label="Name" initialValue={NFTData.name} fullWidth readOnly />
            </Grid>
            <Grid xs={12}>
              <Textarea label="Description" rows={7} fullWidth initialValue={NFTData.description} readOnly />
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={12}>
          <Input label="Price" fullWidth placeholder="New price in ETH" onChange={(e) => updatePrice(e.target.value)} />
        </Grid>
        <Spacer y={1} />
        <Button onPress={listNFTForSale} css={{ width: "100%" }}>
          List NFT
        </Button>
        <Spacer y={2.5} />
      </Grid.Container>
    </Layout>
  );
};

export default Resell;
