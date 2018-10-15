import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profileAction'
import PropTypes from 'prop-types'
import Spinner from '../common/Spinner'

class Dashboard extends Component {

    componentDidMount(){
        this.props.getCurrentProfile()
    }

    _renderDashboardContent(){
        let content;
        const { loading, profile } = this.props.profile
        const { user } = this.props.auth

        if(loading){
            content = <Spinner />
        }else{
            if(profile === null){
                content = <h4>Welcome {user.name}. You don't have profile yet, so please create one</h4>
            }else{
                content = <h4>Content</h4>
            }
            
        }

        return content
    }

    render() {
        return (
        <div className="container">
            <h1>Dashboard</h1>
            {this._renderDashboardContent()}
        </div>
        )
    }
}

Dashboard.propTypes = {
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    profile : state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
