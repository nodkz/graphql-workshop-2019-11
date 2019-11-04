import * as React from 'react';
import { Row, Col } from 'antd';

function Home() {
  return (
    <div>
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '2.5em' }}>
                Northwind data explorer via GraphQL & Apollo Client
                <br />
              </h1>
            </div>
            <Row>
              <Col xs={24} sm={16} style={{ fontSize: '1.5em' }}>
                <p>
                  This is a true story. The events depicted took place in <b>Northwind company</b>{' '}
                  in <b>1996-1998</b>. At the request of the survivors, the names have been changed.
                  Out of respect for the dead, the rest has been told exactly as it occurred.
                </p>
                <p style={{ textAlign: 'right', fontWeight: 'bold' }}>© Fargo</p>
              </Col>
              <Col xs={0} sm={8} style={{ textAlign: 'center' }}>
                <img src="/fargo500.jpg" style={{ maxWidth: '200px', paddingLeft: '5px' }} />
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div>
        <h4>Source code of server-side</h4>
        <a
          href="https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/northwind"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/northwind
        </a>
      </div>
    </div>
  );
}

export default Home;
