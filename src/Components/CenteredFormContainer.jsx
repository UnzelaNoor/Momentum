import React from 'react';
import {Container, Row, Col} from 'react-bootstrap'

const CenteredFormContainer = (props) => {
    return(
        <Container fluid className="bg-light-purple" style={{minHeight: '100vh'}}>
            <Row className='justify-content-md-center align-items-center min-vh-100'>
                <Col xs={11} sm={8} md={6} lg={4} className="text-start bg-white p-4 rounded-4 shadow my-4">
                    {props.children}
                </Col>
            </Row>
        </Container>
    )
}

export default CenteredFormContainer