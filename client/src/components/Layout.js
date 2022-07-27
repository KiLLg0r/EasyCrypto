import { Container } from "@nextui-org/react";

const Layout = ({ children }) => {
  return (
    <Container lg css={{ minHeight: "100vh" }}>
      {children}
    </Container>
  );
};

export default Layout;
