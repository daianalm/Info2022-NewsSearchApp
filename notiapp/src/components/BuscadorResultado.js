import React, { useContext, useEffect, useState } from 'react';
import { Alert, Col, Container, Image, Pagination, Row } from 'react-bootstrap';
import { DataContext } from './Contexto';

export function getStringDate(d) {
    let mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let f, h; // fecha y hora, respectivamente

    if((d === null) || d.trim().length === 0)
        return "0000-00-00 00:00:00";
    
    try {
        f = d.substr(0, 10).trim().split("-");
    } catch (error) {
        f = ["0000", "00", "00"];
    }

    try {
        h = d.substr(11, 5).trim();
    } catch (error) {
        h = "00:00";
    }

    return `${f[2]} de ${mes[parseInt(f[1]-1)]} de ${f[0]} a las ${h} hs.`;
}

export function formatearNumero(n) {
    if(!isNaN(n))
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    return n;
}

/**
 * Array para el paginador.
 * @pPage número de la página actual.
 * @pPageSize número de elementos a mostrar por página.
 * @pTotalPages número total de páginas.
 * @return Devuelve un array con elementos numerados y ordenado que representan las páginas a mostrar en el paginador.
 */
export function getArrayPaginacion(pPage, pPageSize, pTotalPages) {
    // +-+-+-+-+-+-+-+-+-+
    // Paginación - Inicio
    // El objetivo es mostrar 9 elementos y que el del medio sea siempre la página actualmente visitada, siempre y cuando
    // la página actuál no esté a +/- 4 del inicio/fín de paginación.
    
    let a = []; // array que se cargará con los números de páginación a mostrar debajo de los resultados.
    let i, f; // índice de inicio y fin, respectivamente

    // índice de inicio...
    i = pPage > 4 ? 
                (pTotalPages - pPage < 4 ? pTotalPages - 8 : pPage - 4)
                  :
                1;

    // Índice de fín...
    f = (pTotalPages - pPage <= 9) ?
                        (pTotalPages - pPage > 4 ? pPage + 4 : pTotalPages)
                         :
                        (pPage <= 4 ? 9 : pPage + 4);

    for(let x = i; x <= f; x++)
        a.push(x);

    // Paginación - Fin
    // +-+-+-+-+-+-+-+-+
    return a;
}

function BuscadorResultado(props) {

    const array_pages = [10, 20, 30, 40, 50]; // Cantidades de noticias a mostrar por página

    const { nPage, setPage, nPageSize,setPageSize } = useContext(DataContext);
    const [data, setData] = useState(props.data);
   
    useEffect( // Solo se ejecutará cuando props.data cambie.
        () => {
            setData(props.data);
        }, [props.data]
    );

    // Calcular el total de páginas, según el tamaño de elementos a mostrar en cada página (nPageSize).
    let nTotalPages = Math.ceil(data.totalResults / nPageSize);
    // Obtener array para paginación
    let a = getArrayPaginacion(nPage, nPageSize, nTotalPages);

    if(data !== null) { // && data.totalResults > 0
        if(data.totalResults > 0)
            return (
            <>
                {/* CON RESULTADOS */}
                <Container style={{width: '70%'}}>
                    {/* RESULTADOS POR PÁGINA */}
                    <div className="d-flex justify-content-end total-resultados">
                        <div>
                            Está viendo
                            &nbsp; 
                            <select defaultValue={nPageSize} onChange={(e) => setPageSize(e.target.value)}>
                                { data.totalResults < nPageSize ?
                                    <option value={data.totalResults}>{data.totalResults}</option>
                                :
                                    array_pages.map(
                                        (p) => <option key={p} value={p}>{p}</option>
                                    )
                                }
                            </select>
                            &nbsp;
                            noticias de { formatearNumero(data.totalResults) } resultados
                        </div>
                    </div>
                { data.articles.map((article, i) =>
                    <Container className="box" key={i}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col className="pb-2">
                                        <a variant="dark" href={article.url} target="_blank" rel="noreferrer">{article.title}</a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pb-2">
                                        {article.description}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        Publicado por {article.author} ({article.source.name}), el día {getStringDate(article.publishedAt)}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm="auto" className="text-end">
                                <Image rounded src={article.urlToImage} style={{maxHeight: '120px', maxWidth: '150px'}} />
                            </Col>
                        </Row>
                    </Container>
                    ) }
                </Container>

                {/* PAGINACIÓN - INICIO */}
                <Pagination bg="dark" variant="dark" className="paginacion justify-content-center">
                    { nPage > 1 ? 
                        <>
                            <Pagination.First onClick={() => setPage(1)} />
                            <Pagination.Prev onClick={() => setPage(nPage - 1)} />
                        </>
                    : "" }
                { a.map((i) => 
                    <Pagination.Item key={i} active={i === nPage} onClick={() => setPage(i)}>
                        {('0'.repeat(data.totalResults.toString().length + 1) + i).slice(-data.totalResults.toString().length + 1)}
                    </Pagination.Item>
                ) }

                { nPage < nTotalPages ?
                    <>
                        <Pagination.Next onClick={() => setPage(nPage + 1)} />
                        <Pagination.Last onClick={() => setPage(nTotalPages)} />
                    </>
                :
                ""
                }
                </Pagination>
                {/* PAGINACIÓN - FIN */}
            </>
            );
        else // SIN RESULTADOS
            return (
                <Container className="w-50 text-center">
                    <Alert key="dark" variant="dark">
                        No se han obtenido resultados, por favor vuelve a intentarlo.
                    </Alert>
                </Container>
            );
    }
}
export default BuscadorResultado;