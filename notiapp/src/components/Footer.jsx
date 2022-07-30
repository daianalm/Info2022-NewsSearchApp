import { Col, Row } from 'react-bootstrap';
import { useContext } from 'react';
import { DataContext } from './Contexto';

function Footer(/*props*/) {
    const { bHasData } = useContext(DataContext);

    return (
        <footer className={ bHasData ? "footer" : "fixed-bottom footer" }>
            <Row> --TODOS LOS DERECHOS RESERVADOS DLMartinez--2022--Noti APP
            </Row>
        </footer>
    );
}
export default Footer;