import React from 'react'

const ParentProfile = () => {
  return (
    <div className="parent-profile-container flex pt-28">
      <aside className="side-menu w-1/4 p-4">
        <nav>
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#contact">Contact Details</a></li>
            <li><a href="#verify">Verify Account</a></li>
          </ul>
        </nav>
      </aside>
      
      <div className="profile-content flex-1 px-4">
        <header>
          <h1>User Profile Dashboard</h1>
        </header>
        <section>
          <p>Welcome to your profile page featuring:</p>
          <ul>
            <li>Overview</li>
            <li>Contact Detials</li>
            <li>Verify account</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default ParentProfile