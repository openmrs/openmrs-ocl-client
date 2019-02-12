import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

class CardBody extends Component {
  state = {
    showMore: false,
  }

  handleClick = () => this.setState({ showMore: true });

  render() {
    const {
      title,
      body,
      remainingCount,
      remainingItems,
    } = this.props;

    return (
      <React.Fragment>
        <p className="synonyms">{title}</p>
        {remainingCount > 0 && !this.state.showMore
          ? <div className="pop-up-description rounded">
            {renderHTML(body)}
            <div className="showOthers" onClick={this.handleClick}>
            ...and &nbsp;
              {remainingCount}
            &nbsp;more
            </div>
          </div>
          : <div className="pop-up-description rounded">
            {renderHTML(body.concat(remainingItems))}
          </div>
        }
      </React.Fragment>
    );
  }
}


CardBody.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  remainingCount: PropTypes.number,
  remainingItems: PropTypes.string,
};

CardBody.defaultProps = {
  body: '',
  remainingCount: null,
  remainingItems: '',
};

export default CardBody;
