import { ethers } from "ethers";
import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";

import { nftContractAbi, nftContractAddress } from "../utils/constants";

import { Button, Container, Input, Textarea, Col, Spacer, Text } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import Layout from "./Layout";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: "", name: "", description: "" });

  const router = useNavigate();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, { value: listingPrice });
    await transaction.wait();

    router("../marketplace");
  }

  return (
    <Layout>
      <Container xs>
        <Col>
          <Text h2 color="primary" css={{ marginBlock: "2rem", textAlign: "center" }}>
            Create your own NFT
          </Text>
          {fileUrl && (
            <>
              <img
                src={fileUrl}
                alt="NFT"
                height={300}
                width={300}
                style={{ objectFit: "cover", display: "block", marginInline: "auto", borderRadius: "0.875rem" }}
              />
              <Spacer y={1} />
            </>
          )}
          <Input fullWidth type="file" onChange={onChange} placeholder="Asset image" label="Image" />
          <Input
            label="Name"
            placeholder="Asset name"
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
            fullWidth
          />
          <Textarea
            label="Description"
            rows={7}
            fullWidth
            placeholder="Asset description"
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <Input
            label="Price"
            fullWidth
            placeholder="Asset price in ETH"
            onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <Spacer y={1} />
          <Button onPress={listNFTForSale} css={{ width: "100%" }}>
            Create NFT
          </Button>
          <Spacer y={2.5} />
        </Col>
      </Container>
    </Layout>
  );
};

export default CreateNFT;
