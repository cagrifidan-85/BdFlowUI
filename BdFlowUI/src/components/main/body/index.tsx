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



export const Body = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [scrollPosition,setScrollPosition]= useState(500)
  const [showSelection, setShowSelection] = useState(false);
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

  console.log('selectedMaterial',selectedMaterial)
  console.log('selectedEnvironment',selectedEnvironment)
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
      <CalculateProduct onSelectMaterial={setSelectedMaterial} onSelectEnvironment={setSelectedEnvironment} isSelectionActive={showSelection} onSelectionActive={setShowSelection}/>

    </Box>
  );
};
export default Body;
