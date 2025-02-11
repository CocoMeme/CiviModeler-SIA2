import React from 'react'

const Overview = () => {
  return (
    <div className="overview-container">
      {/* User Information */}
      <header className="overview-header">
        <h2>User Profile</h2>
        <p>Name: John Doe</p>
        <p>Email: john.doe@example.com</p>
      </header>
      
      {/* Biography Section */}
      <section className="overview-bio">
        <h3>Biography</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae semper dui.</p>
      </section>
      
      {/* Recent Activity Section */}
      <section className="overview-activity">
        <h3>Recent Activity</h3>
        <ul>
          <li>Logged in from IP 192.168.1.1</li>
          <li>Updated profile picture</li>
          <li>Changed account settings</li>
        </ul>
      </section>
    </div>
  )
}

export default Overview