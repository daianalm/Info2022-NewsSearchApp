import { Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Error404(/*props*/) {
  return (
    <Container>
      <Row>
        <Col className="md-12">
          <div className="error-template">
              <h1>Oops!</h1>
              <h2>Error 404</h2>
              <div className="error-details">Recurso no encontrado</div>
              <div className="error-actions">
                  <LinkContainer to="/">
                    <a href="#home" className="btn btn-secondary btn-lg">Inicio</a>
                  </LinkContainer>
              </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Error404;