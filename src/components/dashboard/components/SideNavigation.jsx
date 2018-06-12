import React from 'react';
import AddDictionary from './dictionary/AddDictionary';

class SideNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleHide = () =>
    this.setState({ show: false });

  handleShow= () =>
    this.setState({ show: true });


  render() {
    return (

      <div className="side-nav d-none d-md-block d-lg-block">
        <ul className="nav flex-column">
          <li className="nav-item">
        <a className="nav-link active" href="#" onClick={this.handleShow}>
          Add Dictionary
        </a>
          </li>
        </ul>
        <AddDictionary
          show={this.state.show}
          handleHide={this.handleHide}
        />
      </div>
    );
  }
}
export default SideNavigation;
