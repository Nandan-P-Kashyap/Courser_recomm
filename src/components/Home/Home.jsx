import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [visibleLogos, setVisibleLogos] = useState([]);

  // Corrected website list with working logo links
  const websites = [
    { name: "Canva", url: "https://www.canva.com/", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_logo.svg" },
    { name: "Udemy", url: "https://www.udemy.com/", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg" },
    { name: "Looka", url: "https://assets.looka.com/images/logos/logo-looka.png", url: "https://looka.com/" },
    { name: "100xDevs", url: "https://100xdevs.com/", logo: "https://yt3.googleusercontent.com/ytc/AIdro_nZaL8HjF9Lh-DXvlDcf9FcE54R_vBNweDdS34CHw=s900-c-k-c0x00ffffff-no-rj" },
    { name: "Hatchful", url: "https://www.shopify.com/tools/logo-maker", logo: "https://cdn.shopify.com/s/files/1/0070/7032/files/Hatchful_favicon_f2485f00-1b9b-45b2-875e-18ed65ed4a1a.png?v=1685634951" },
  ];

  useEffect(() => {
    // Duplicating the logos to create a seamless infinite scroll effect
    setVisibleLogos([...websites, ...websites]);
  }, [websites]);

  return (
    <div className="logo-scroller">
      <motion.div
        className="scrolling-ribbon"
        animate={{ x: ["2%", "-100%"] }}
        transition={{ ease: "linear", duration: 100, repeat: Infinity }}
      >
        {visibleLogos.map((site, index) => (
          <a href={site.url} target="_blank" rel="noopener noreferrer" key={index} className="logo-container">
            <motion.div className="glass-bg">
              <img src={site.logo} alt={site.name} className="logo" />
            </motion.div>
          </a>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
