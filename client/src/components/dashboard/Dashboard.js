import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profileAction'
import PropTypes from 'prop-types'

class Dashboard extends Component {

    componentDidMount(){
        this.props.getCurrentProfile()
    }

    render() {
        return (
        <div>
            <h1>Dashboard</h1>
        </div>
        )
    }
}

Dashboard.propTypes = {
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    profile : state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
