import React, { Component } from 'react';
import { Col, Row, Preloader, CollapsibleItem } from 'react-materialize';
import NeedSearch from '../../Tools/NeedSearch';
import MapView from '../../Tools/MapView';
import NeedList from '../../Tools/NeedList';
import './style.css';
import Collapsible from 'react-materialize/lib/Collapsible';
import API from '../../../utils/API';

class GiveHelp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needs: [],
      cntLat: 33.785,
      cntLng: -84.385,
      goodSamaritinButton: '',
      // isModalOpen: false
      isMapModalOpen: false
    };

    this.getNeeds = this.getNeeds.bind(this);
    this.setCenter = this.setCenter.bind(this);
    this.filterBySearch = this.filterBySearch.bind(this);
    this.GoodSamaratinRecordUpdate = this.GoodSamaratinRecordUpdate.bind(this);
    this.offerHelp = this.offerHelp.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  getNeeds() {
    API.getNeeds()
      .then(res => {
        var returnedNeed = res.data;
        var unresolvedReturnedNeed = returnedNeed.filter(need => !need.resolved);
        this.setState({ needs: unresolvedReturnedNeed });
      })
      .catch(err => console.log(err));
  }

  setCenter(lat, lng) {
    this.setState({
      cntLat: lat,
      cntLng: lng,
    });
  }

  filterBySearch(category, keyword, needdate) {
    API.getNeedsBySearch(category, keyword, needdate)
      .then(res => this.setState({ needs: res.data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.getNeeds();
  }

  offerHelp(id) {
    // this.setState({ offerHelp: true})
    API.donateHelp({ needId: id })
      .then(res => {
        const needId = res.data._id;
        const needCategory = res.data.category;
        this.GoodSamaratinRecordUpdate(needId, needCategory);
      }).catch(err => console.log(err));

  }

  handleCloseModal() {
    this.setState({
      isMapModalOpen: false
    });
  }

  handleOpenModal() {
    this.setState({
      isMapModalOpen: true
    });
  }


  GoodSamaratinRecordUpdate(needId, needCategory) {
    API.updateGoodSamaratinRecord({ needId, needCategory })
      .then(() => {
        alert('Email Sent!');
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className='Give-Help-Wrapper'>
        <Row>
          <Col id='left-column' s='12' l='4'>
            <Collapsible defaultActiveKey={0}>
              <CollapsibleItem header='Search Needs' icon='search'>
                <NeedSearch
                  category={this.state.category}
                  filterBySearch={this.filterBySearch}
                  getNeeds={this.getNeeds}
                />
              </CollapsibleItem>
              <CollapsibleItem id='list-collapsible' header='List of Needs' icon='list'>
                <NeedList
                  onHoverEvent={this.setCenter}
                  className='list-view'
                  needs={this.state.needs.filter(need => need.user._id !== this.props.user._id && !need.resolved)}
                  currentUserID={this.props.user._id}
                  offerHelp={this.offerHelp}
                  // isModalOpen={this.state.isModalOpen}
                  goodSamaritinButton={this.props.goodSamaritinButton}
                />
              </CollapsibleItem>
            </Collapsible>
          </Col>
          <Col s={12} l={8}>
            <MapView
              needs={this.state.needs.filter(need => need.user._id !== this.props.user._id && !need.resolved)}
              cntLat={this.state.cntLat}
              cntLng={this.state.cntLng}
              currentUserID={this.props.user._id}
              offerHelp={this.offerHelp}
              GoodSamaratinRecordUpdate={this.GoodSamaratinRecordUpdate}
              isMapModalOpen={this.state.isMapModalOpen}
              handleOpenModal={this.handleOpenModal}
              handleClosenModal={this.handleClosenModal}
            >
              <Preloader flashing />
            </MapView>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GiveHelp;
