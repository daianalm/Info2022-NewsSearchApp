import React, { createContext, useState } from 'react';

export const DataContext = createContext();

function DataProvider(props) {
  
    const [strLanguage, setLanguage] = useState("es"); // valor predeterminado
    const [nPage, setPage] = useState(1); // valor predeterminado
    const [nPageSize, setPageSize] = useState(10); // valor predeterminado
    const [bHasData, setHasData] = useState(false); // valor predeterminado

    return (
        <DataContext.Provider value={{nPage, setPage, nPageSize, setPageSize, strLanguage, setLanguage, bHasData, setHasData}}>
        {props.children}
        </DataContext.Provider>
  );
}
export default DataProvider;