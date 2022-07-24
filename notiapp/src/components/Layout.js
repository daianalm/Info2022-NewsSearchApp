import React, { createContext, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

export const PaginacionContext = createContext();

export const Layout=(props)=> {

    const [strLanguage, setLanguage] = useState("es"); // valor predeterminado
    const [nPage, setPage] = useState(1); // valor predeterminado
    const [nPageSize, setPageSize] = useState(10); // valor predeterminado

    return(
        <PaginacionContext.Provider value={{nPage, setPage, nPageSize, setPageSize, strLanguage, setLanguage}}>
            <Header />
            { props.children }
            <Footer />
        </PaginacionContext.Provider>
    );
}