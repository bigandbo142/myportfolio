import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextFieldGroup  = ({
    name,
    type,
    placeholder,
    value,
    onChange,
    info,
    error,
    disabled
}) => {
    return (
        <div className="form-group">
            <input 
                type={type}
                className={classnames('form-control form-control-lg',
                    {"is-invalid" : error}
                )} 
                placeholder={placeholder} 
                name={name} 
                value={value}
                onChange={onChange}
                disabled={disabled}
                />
            {info && (<small className="form-text text-muted">{info}</small>)}
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
}

TextFieldGroup.propTypes = {
    name : PropTypes.string.isRequired,
    type : PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    error : PropTypes.string,
    info : PropTypes.string,
    disable: PropTypes.bool
}

TextFieldGroup.defaultProps = {
    type : 'text',
    disabled: false
}

export default TextFieldGroup