import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'

import { getRepositoryLink } from '../../util'

export class GaugeCard extends Component {
  render () {
    // TODO adjust retrieval of attributes to be smarter
    // (Get the definition of the function blocks and find attribute values)
    const values = this.props.feature.properties
    const currVal = values.status.value.currentMeasured || 0
    const minVal = values.status.value.minMeasured || 0
    const maxVal = values.status.value.maxMeasured || currVal

    const currDeg = ((currVal - minVal) * 180) / (maxVal - minVal)

    const fontSize = `${currVal}`.length > 4 ? 32 : 48

    return (
      <div className='card card-stats attr-card'>
        <div className='content'>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className='text-center'>
                <h4>
                  <a href={getRepositoryLink(this.props.feature.definition)} target='_blank' >{this.props.featureName}</a>
                </h4>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className='inner-card-container'>
                <div className='gauge'>
                  <div className='gauge-percentage' style={{ transform: `rotate(${currDeg}deg)` }} />
                  <span className='gauge-value data-val' style={{
                    fontSize: `${fontSize}px`
                  }}>{currVal}</span>
                </div>
                <div className='gauge-mask' />
                <span className='gauge-min data-val'>{minVal}</span>
                <span className='gauge-max data-val'>{maxVal}</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default GaugeCard
