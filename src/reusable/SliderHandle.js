import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

export default class Handle extends React.Component {
  state = {
    clickFocused: false,
  };

  componentDidMount() {
    // mouseup won't trigger if mouse moved out of handle,
    // so we listen on document here.
    this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove();
    }
  }

  setClickFocus(focused) {
    this.setState({ clickFocused: focused });
  }

  handleMouseUp = () => {
      this.setClickFocus(false);
  };

  handleMouseDown = () => {
      this.setClickFocus(true);
  };

  focus() {
    this.handle.focus();
  }

  onBlur() {
      this.handle.blur();
  }

  render() {
    const {
      vertical, offset, style, disabled, min, max, value, tabIndex, ...restProps,
    } = this.props;

    const className = classNames(
      this.props.className,
      {
        ['rc-handle-click-focus ']: this.state.clickFocused,
      }
    );

    const postionStyle = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` };
    const elStyle = {
      ...style,
      ...postionStyle,
    };
    let ariaProps = {};
    if (value !== undefined) {
      ariaProps = {
        ...ariaProps,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled,
      };
    }
    return (
      <div
        ref={node => (this.handle = node)}
        role="slider"
        tabIndex= {tabIndex || 0}
        {...ariaProps}
        {...restProps}
        className={className}
        style={elStyle}
        onMouseDown={this.handleMouseDown}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

Handle.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  vertical: PropTypes.bool,
  offset: PropTypes.number,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  tabIndex: PropTypes.number,
};
