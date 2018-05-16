import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SideNavigation from './SideNavigation';
/**
 * Component for rendering the main page
 */
class Dashboard extends Component {
  render() {
    return (
      <div>
      <SideNavigation />
      </div>
    );
  }
}
export default Dashboard;
