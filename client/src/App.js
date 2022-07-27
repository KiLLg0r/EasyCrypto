import { createTheme, NextUIProvider } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Transactions from "./components/Transactions";
import MyNFTs from "./components/MyNFTs";
import CreateNFT from "./components/CreateNFT";
import Marketplace from "./components/Marketplace";
import Header from "./components/Header";

function App() {
  const lightTheme = createTheme({
    type: "light",
    theme: {
      colors: {
        background: "#ffffff",
        backgroundSecondary: "#eaeaeb",
        text: "#20232a",
        textSecondary: "#282c34",
        navBackground: "rgba(255,255,255,0.85)",
      },
    },
  });

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: {
        background: "#20232a",
        backgroundSecondary: "#282c34",
        text: "#eaeaeb",
        textSecondary: "#bfc0c2",
        navBackground: "rgba(0,0,0,0.85)",
      },
    },
  });

  const darkMode = useDarkMode(false);

  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/create-nft" element={<CreateNFT />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;
