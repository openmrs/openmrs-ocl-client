import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import PreviewCard from './PreviewCard';

export class ActionButtons extends Component {
  static propTypes = {
    previewConcept: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    params: PropTypes.shape({
      type: PropTypes.string,
      typeName: PropTypes.string,
      collectionName: PropTypes.string,
    }).isRequired,
    preview: PropTypes.shape({
      url: PropTypes.string,
      display_name: PropTypes.string,
    }).isRequired,
    addConcept: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  };
  closeModal = () => {
    this.setState({ open: false });
  };

  fetchPreview = () => {
    this.props.previewConcept(this.props.id);
    this.openModal();
  };

  addConcept = (conceptUrl, name) => {
    const { params } = this.props;
    const data = { data: { expressions: [conceptUrl] } };
    this.props.addConcept(params, data, name);
  };

  addConceptButton = () => {
    notify.show('Adding...', 'warning', 800);

    this.fetchPreview(this.props.id);
    this.closeModal();
    setTimeout(() => {
      this.addConcept(this.props.preview.url, this.props.preview.display_name);
    }, 1000);
  };

  render() {
    return (
      <React.Fragment>
        <button
          className="btn btn-sm mr-2 no-shadow bg-gray mb-1"
          id="add-button"
          onClick={() => this.addConceptButton()}
        >
          Add concept
        </button>
        <div
          className="d-inline"
          id="preview"
          onClick={() => this.fetchPreview(this.props.id)}
          role="presentation"
        >
          <Popup
            open={this.state.open}
            trigger={<button className="btn btn-sm no-shadow bg-gray mb-1">Preview concept</button>}
            position="left center"
            on="click"
            onClose={this.closeModal}
            contentStyle={{ width: '20rem', borderRadius: '.4rem' }}
          >
            <PreviewCard
              concept={this.props.preview}
              addConcept={this.addConcept}
              closeModal={this.closeModal}
            />
          </Popup>
        </div>
      </React.Fragment>
    );
  }
}

export default ActionButtons;
