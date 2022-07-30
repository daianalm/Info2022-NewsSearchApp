import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ContextoDatos = createContext();

export const DataProvider = (props) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // acá seteas tu state loading a true si necesitas
        const response = await axios(
          `https://newsapi.org/v2/everything?q=warzone&language=es&pageSize=10&page=1&sortBy=publishedAt&apiKey=72e623b2c937460795bee83bda1b9db9`
        );
        setArticles(response.data.articles);
      } catch (error) {
      } finally {}})();
  }, []);

  return (

    <ContextoDatos.Provider value={{ articles }}>
      {props.children}
    </ContextoDatos.Provider>
  );
};