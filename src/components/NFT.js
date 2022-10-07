import { Card, Col, Text } from "@nextui-org/react";

const NFT = ({ img, name, desc, price, button }) => {
  return (
    <Card css={{ height: "535px", width: "300px" }}>
      <Card.Body>
        <Col>
          <img
            src={img}
            alt="NFT placeholder"
            width={300}
            height={300}
            style={{ objectFit: "cover", borderRadius: "0.625rem" }}
          />
          <Text h3>{name}</Text>
          <Text p css={{ overflow: "hidden", maxHeight: "3rem", height: "fit-content" }}>
            {desc}
          </Text>
          <Text h3 color="success">
            {price} ETH
          </Text>
        </Col>
      </Card.Body>
      <Card.Footer>{button}</Card.Footer>
    </Card>
  );
};

export default NFT;
