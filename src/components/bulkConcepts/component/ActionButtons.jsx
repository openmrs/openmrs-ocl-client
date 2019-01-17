import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
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
      disableButton: false,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  fetchPreview = (id) => {
    this.props.previewConcept(id);
    this.openModal();
  };

  addConcept = (conceptUrl, name) => {
    const { params } = this.props;
    const data = { data: { expressions: [conceptUrl] } };
    this.props.addConcept(params, data, name);
  };

  addConceptButton = (id, url, display_name) => {
    this.setState({ disableButton: true });
    notify.show('Adding...', 'warning', 800);

    this.fetchPreview(id);
    this.closeModal();
    setTimeout(() => {
      this.addConcept(url, display_name);
    }, 1000);
  };

  render() {
    const { disableButton } = this.state;
    return (
      <React.Fragment>
        <button
          type="submit"
          className="btn btn-sm mb-1 actionaButtons"
          id="add-button"
          onClick={() => this.addConceptButton(
            this.props.id,
            this.props.preview.url,
            this.props.preview.display_name,
          )
          }
          disabled={disableButton}
        >
          Add concept
        </button>
        <div
          className="d-inline"
          id="preview"
          onClick={() => this.fetchPreview(this.props.id)}
          role="presentation"
        >
          <button type="button" className="btn btn-sm mb-1 actionaButtons">
            Preview concept
            <PreviewCard
              open={this.state.open}
              concept={this.props.preview}
              addConcept={this.addConcept}
              closeModal={this.closeModal}
            />
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default ActionButtons;
