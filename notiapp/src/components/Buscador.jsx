import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap';
import Axios from 'axios';
import { DataContext } from './Contexto';
import BuscadorResultado from './BuscadorResultado';

function Buscador() {
    const strApiKey = '72e623b2c937460795bee83bda1b9db9';
    
    const array_errors = [ // Listado de algunos errores que puede devolver newsapi.org en las peticiones.
        {code: "apiKeyDisabled", text: "Su API Key ha sido deshabilitada."},
        {code: "apiKeyExhausted", text: "Su API Key no tiene más solicitudes disponibles."},
        {code: "apiKeyInvalid", text: "Su API Key no se ha ingresado correctamente. Compruébelo dos veces e inténtalo de nuevo."},
        {code: "apiKeyMissing", text: "Falta su API Key en la solicitud."},
        {code: "corsNotAllowed", text: "El Intercambio de Recursos de Origen Cruzado (CORS) no está habilitado."},
        {code: "maximumResultsReached", text: "Se ha alcanzado el máximo de resultados que permite obtener newsapi.org"},
        {code: "parameterInvalid", text: "Ha incluido un parámetro en su solicitud que actualmente no se admite."},
        {code: "parametersMissing", text: "Faltan parámetros obligatorios en la solicitud y no se puede completar."},
        {code: "rateLimited", text: "Se le ha limitado la tarifa. Inténtelo más tarde."},
        {code: "sourcesTooMany", text: "Ha solicitado demasiadas fuentes en una sola solicitud. Intente dividir la solicitud en dos solicitudes más pequeñas."},
        {code: "sourceDoesNotExist", text: "Ha solicitado una fuente que no existe."},
        {code: "unexpectedError", text: "Error inesperado, el servidor no está respondiendo correctamente."},
        {code: "ERR_NETWORK", text: "Error de conexión, no tienes conexión a internet o bien, el servidor no está en línea."},
        {code: "ERR_INTERNET_DISCONNECTED", text: "Se ha perdido la conexión a internet."},
        {code: "ERR_BAD_REQUEST", text: "Respuesta del servidor no válida."}
    ];


    const { nPage, setPage, nPageSize, strLanguage, setHasData } = useContext(DataContext);

    const [error, setError] = useState(null);
    const [bCargando, setCargando] = useState(false);
    const [bBotonDeshabilitado, setBotonDeshabilitado] = useState(true); // si está deshabilitado el botón de búsqueda
    const [bTextoDeshabilitado, setTextoDeshabilitado] = useState(false); // Para bloquearlo mientras está activo el Axios
    const [strBuscar, setBuscar] = useState(""); // el texto a buscar
    const [data, setData] = useState(null); // resultados de la búsqueda

    const searchOnChange = event => { // capturar los eventos de tipeo en el input="text"
        setBotonDeshabilitado(event.target.value.trim().length < 3 ? true : false);
        setBuscar(event.target.value.trim());
    };

    const onSubmit = (event) => { // iniciar la búsquedar
        event.preventDefault();
        setPage(1);
        fxBuscar();
    };

    const onKeyDown = (event) => { // capturar el evento [ENTER] en el input="text"
        if (event.key === 'Enter') {
            onSubmit(event);
        }
    }

    const fxBuscar = () => {
        if(!bBotonDeshabilitado && strBuscar.trim().length > 2) { // Si no está deshabilitado, realizar la búsqueda
            setCargando(true);
            setError(null);
            setData(null);
            setTextoDeshabilitado(true);
            setBotonDeshabilitado(true);

            let strURI = `https://newsapi.org/v2/everything?q=${strBuscar}&language=es&pageSize=${nPageSize}&page=${nPage}&sortBy=publishedAt&apiKey=${strApiKey}`;
           

            Axios({ url: strURI, })
                .then((response) => {
                    setData(response.data);
                })
                .catch((error) => {
                    setError(error);
                })
                .finally(() => {
                    //setHasData(data !== null && data.totalResults > 0);
                    setTextoDeshabilitado(false);
                    setBotonDeshabilitado(false);
                    setCargando(false);
                });
        }
    };

    useEffect(
        () => {
            if(strBuscar.trim().length > 2 && data !== null)
                fxBuscar();
        }, [strLanguage, nPageSize, nPage]
    );

    useEffect(
        () => {
            setHasData(data !== null && data.totalResults > 0);
        }, [data, setHasData]
    );

    if(bCargando) // Si la newsapi.org no terminó de devolver una respuesta, se mostrará el spinner.
        return (<div className="d-flex justify-content-center cargando"><Spinner animation="border" variant="light" />&nbsp;Saludando al servidor...</div>);

    return (
        <>
        <div className="d-flex justify-content-center m-4">
            <form>
                <Row className="mt-2">
                        <FloatingLabel label="Buscar: Argentina">
                            <Form.Control onChange={searchOnChange} value={strBuscar} onKeyDown={onKeyDown} disabled={bTextoDeshabilitado} id="buscar" placeholder="Buscar: Argentina" />
                        </FloatingLabel>
                </Row>
                <Row className="mt-2">
                    <Button type="submit" variant={bBotonDeshabilitado ? "secondary" : "primary"} onClick={onSubmit} disabled={bBotonDeshabilitado}>Buscar</Button>
                </Row>
            </form>
        </div>

        { data !== null ?
                <BuscadorResultado data={data} pageSize={data !== null && data.totalResults < nPageSize ? data.totalResults : nPageSize} />
        :
            (error !== null ?
            <Container className="w-50">
                <Alert key="warning" variant="warning">
                    <Row>
                        <Col>
                        <strong>Se ha producido un error. Servidor no encontrado.</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong>Código de error:&nbsp;</strong>{ error.response.data !== null ? error.response.data.code : error.code }
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-break">
                            <strong>Mensaje:</strong>&nbsp;{ array_errors.filter((e) => e.code === (error.response.data !== null ? error.response.data.code : error.code))
                                                            .map(e => {return(e.text);}) }
                        </Col>
                    </Row>
                </Alert>
            </Container>
            :
            ""
            )
        }
        </>
    );
}
export default Buscador;