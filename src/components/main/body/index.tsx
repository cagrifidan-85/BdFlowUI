import { Box, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { NavigationBar } from "./navigationBar";
import img1 from "../../../sliderContent/1.jpg";
import img2 from "../../../sliderContent/2.jpg";
import img3 from "../../../sliderContent/3.jpg";
import styles from "./style.module.scss";
import {  useState } from "react";
import CalculateProduct from "./calculateProduct";
import React, {useEffect}from "react";
import { EnvironmentType, MaterialType } from "@constants/index";



export const Body = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | undefined>()
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentType | undefined>()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [scrollPosition,setScrollPosition]= useState(500)
  const [showSelection, setShowSelection] = useState(false)
  const items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      img: img1,
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: img2,
    },
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      img: img3,
    },
  ];

  useEffect(() => {
    if (scrollPosition > 0) {
      setTimeout(() => window.scrollTo(0, scrollPosition), 5);

      setScrollPosition(0);
    }
  }, [scrollPosition]);

 
  return (
    <Box className={styles.body} >
   
      <NavigationBar />
      <Box>
       {!showSelection &&<Carousel autoPlay duration={2} animation="slide" stopAutoPlayOnHover>
          {items.map((item, i) => (
            <Paper key={i}>
              <img src={item.img} height={300} width="100%" />
            </Paper>
          ))}
        </Carousel>
}
      </Box>
      
      <Box className={styles.body__content}>
        <Box className={styles.body__contentSection}>
          <Box className={styles.body__contentHeader}>
            <Box className={styles.body__contentTitle}>Sana Uygun Sensör Bul</Box>
            <Box className={styles.body__contentSubtitle}>
              Endüstriyel otomasyon ihtiyaçlarınız için en uygun sensör çözümlerini keşfedin
            </Box>
          </Box>

          <Box className={styles.body__contentGrid}>
            <Box 
              className={styles.body__contentCard}
              onClick={() => {
                setShowSelection(true);
                setTimeout(() => {
                  const element = document.querySelector('[data-sensor-selection]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Box className={styles.body__contentCardIcon}>🎯</Box>
              <Box className={styles.body__contentCardTitle}>Kolay Seçim</Box>
              <Box className={styles.body__contentCardText}>
                Basit adımlarla ihtiyacınıza uygun sensörü bulun. Malzeme, ortam ve ürün seçimleriyle hızlıca sonuca ulaşın.
              </Box>
            </Box>

            <Box className={styles.body__contentCard} onClick={() =>  setShowSelection(false)}>
              <Box className={styles.body__contentCardIcon}>⚡</Box>
              <Box className={styles.body__contentCardTitle}>Hızlı Sonuç</Box>
              <Box className={styles.body__contentCardText}>
                Gelişmiş algoritma sayesinde saniyeler içinde en uygun sensör önerilerini alın.
              </Box>
            </Box>

            <Box className={styles.body__contentCard} onClick={() =>  setShowSelection(false)}>
              <Box className={styles.body__contentCardIcon}>🔧</Box>
              <Box className={styles.body__contentCardTitle}>Teknik Destek</Box>
              <Box className={styles.body__contentCardText}>
                Uzman ekibimiz tüm süreçte yanınızda. Teknik sorularınız için 7/24 destek sunuyoruz.
              </Box>
            </Box>

            <Box className={styles.body__contentCard} onClick={() => setShowSelection(false)}>
              <Box className={styles.body__contentCardIcon}>✓</Box>
              <Box className={styles.body__contentCardTitle}>Kalite Garantisi</Box>
              <Box className={styles.body__contentCardText}>
                Endüstri standartlarında, yüksek kaliteli sensör çözümleri ile işlerinizi güvence altına alın.
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box data-sensor-selection>
        <CalculateProduct onSelectMaterial={setSelectedMaterial} onSelectEnvironment={setSelectedEnvironment} onSelectProduct={setSelectedProduct} isSelectionActive={showSelection} onSelectionActive={setShowSelection} material={selectedMaterial} environment={selectedEnvironment} />
      </Box>

    </Box>
  );
};
export default Body;
