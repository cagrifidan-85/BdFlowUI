import React, { useEffect } from "react";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import { Box, CircularProgress } from "@mui/material";
import styles from "./style.module.scss";

// import { useGetTodosQuery } from "../../apis/todos"



export const Main = () => {
  const lang = localStorage.getItem("currentLang");

  useEffect( ()=>{
    localStorage.setItem("currentLang", 'tr');

    const response =  fetch('/todos').then((res) => res.json()).then((res)=> console.log('dadas',res.data))

  },[])
  
 
  const handleChangeLang = (lang: string | null) => {
    if (lang) {
      localStorage.setItem("currentLang", lang);
      window.location.reload();
    }
  };

//  const {data, isLoading} =useGetTodosQuery()

//   console.log('data',isLoading, data)


  return (
    <Box className={styles.main} >
      <Header currentLang={lang} onChangeLang={handleChangeLang} />
      {lang !== null ? (
        <Box className={styles.main__content}>
          <Body />
          <Footer />
        </Box>
      ) : (
        <Box className={styles.main__loader}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Main;
