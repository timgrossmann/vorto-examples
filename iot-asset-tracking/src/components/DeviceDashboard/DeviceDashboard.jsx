import React, {Component} from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { pollThings } from '../../util/DataPoller'
import { applyFilters } from '../../util/ViewFilters'
import { getTextAfterColon } from '../../util'
import Spinner from '../Spinner/Spinner';

import AttributesCard from '../AttributesCard/AttributesCard'
import CodeCard from '../CodeCard/CodeCard'
import LocationCard from '../LocationCard/LocationCard'
import GaugeCard from '../GaugeCard/GaugeCard'
import PercentageCard from '../PercentageCard/PercentageCard'
import ThermometerCard from '../ThermometerCard/ThermometerCard'
import BarChart3Card from '../BarChart3Card/BarChart3Card'
import BatteryCard from '../BatteryCard/BatteryCard'
import StateNumberCard from '../StateNumberCard/StateNumberCard'
import ImageCard from '../ImageCard/ImageCard'
import ConnectivityCard from '../ConnectivityCard/ConnectivityCard'

// To be removed once the Mapping Engine supports nested Function Blocks
import DemoThermometerCard from '../DemoThermometerCard/DemoThermometerCard'
import DemoStateNumberCard from '../DemoStateNumberCard/DemoStateNumberCard'
import DemoGaugeCard from '../DemoGaugeCard/DemoGaugeCard'

import {
  CATEGORIES,
  mapDeftoCardCategorie
} from '../../util/cardUtils'

import log from 'loglevel'
log.setLevel(process.env.REACT_APP_LOG_LEVEL || 'debug')
const DEVICE_REFRESH_MS = process.env.REACT_APP_DEVICE_REFRESH_MS || 5000

function pollDevices(deviceId) {
  pollThings()
    .then(things => applyFilters(things))
    .then(things => {
      return Promise.resolve(
        things.find(thing => thing.thingId === deviceId)
      )})
    .then(thing => {
      this.setState({
        ...this.state,
        device: thing
      })
    })
    .catch(err => `Could not poll devices... ${err}`)
}

const mapCategorieToCard = (categorieType, device, featureObj, featureName) => {
  switch (categorieType) {
    case CATEGORIES.GAGE:
      return (
        <GaugeCard
          featureName={featureName}
          feature={featureObj} />
      )
    case CATEGORIES.BAR3CHART:
      return (
        <BarChart3Card
          featureName={featureName}
          feature={featureObj} />
      )
    case CATEGORIES.PERCENTAGE:
      return (
        <PercentageCard
          featureName={featureName}
          feature={featureObj} />
      )
    case CATEGORIES.TEMPERATURE:
      return (
        <ThermometerCard
          featureName={featureName}
          feature={featureObj} />
      )
    case CATEGORIES.BATTERY:
      return (
        <BatteryCard
          featureName={featureName}
          feature={featureObj} />
      )
    case CATEGORIES.LOCATION:
      return (
        <LocationCard
          featureName={featureName}
          device={device} />
      )
    case CATEGORIES.IMAGE:
      return (
        <ImageCard
          featureName={featureName}
          feature={featureObj} />
      )
    case CATEGORIES.CONNECTION:
      return (
        <ConnectivityCard
          featureName={featureName}
          feature={featureObj} />)
    case CATEGORIES.STATE_NUMBER:
      return (
        <StateNumberCard
          featureName={featureName}
          feature={featureObj} />)

    // To be removed once the Mapping Engine supports nested Function Blocks
    case CATEGORIES.DEMO_TEMPERATURE:
      return (
        <DemoThermometerCard
          featureName={featureName}
          feature={featureObj} />)
    case CATEGORIES.DEMO_STATE_NUMBER:
      return (
        <DemoStateNumberCard
          featureName={featureName}
          feature={featureObj} />)
    case CATEGORIES.DEMO_GAGE:
      return (
        <DemoGaugeCard
          featureName={featureName}
          feature={featureObj} />)
    default:
      return (
        <CodeCard
          featureName={featureName}
          feature={featureObj} />
      )
  }
}

class DeviceDashboard extends Component {
  state = {
    loading: true,
    device: {}
  }

  componentDidMount() {
    this.thingInterval = setInterval(pollDevices.bind(this, this.props.deviceId), DEVICE_REFRESH_MS)
  }

  componentWillUnmount() {
    clearInterval(this.thingInterval)
  }

  render () {
    const device = this.state.device

    if (this.state.loading && Object.keys(device).length !== 0) {
      this.setState({
        ...this.state,
        loading: false
      })
    }

    if (this.state.loading) {
      return <Spinner />
    }

    const row = Object.keys(device.features)
      .sort()
      .map((featureName, index) => {
        const featureObj = device.features[featureName]
        const featureDefs = featureObj.definition

        const categorieType = mapDeftoCardCategorie(featureDefs)

        if (categorieType === CATEGORIES.NO_WIDGET) {
          return null
        }

        const featureCard = mapCategorieToCard(categorieType, device, featureObj, featureName)

        return (<Col xs={12} sm={6} md={6} lg={4} key={index}>{featureCard}</Col>)
      })

    return (
      <div className='content' >
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <AttributesCard
                device={device}
              />
            </Col>
          </Row>

          <Row>
            {row}
          </Row>
        </Grid>
      </div>
    )
  }
}

export default DeviceDashboard
