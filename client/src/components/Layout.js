import { Container } from "@nextui-org/react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Container lg css={{ minHeight: "100vh" }}>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
