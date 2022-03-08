import React from 'react';
import styled from "styled-components";

const defaultProps = {
    breakpointCols: undefined, // optional, number or object { default: number, [key: number]: number }
    className: undefined, // required, string
    columnClassName: undefined, // optional, string
    children: undefined,
    columnAttrs: undefined, // object, added to the columns
    column: undefined
};

const DEFAULT_COLUMNS = 2;
const Wrapper = styled.div`{
  display: -webkit-box; /* Not needed if autoprefixing */
  display: -ms-flexbox; /* Not needed if autoprefixing */
  display: flex;
  width: auto;

  .masonry-grid-column:nth-child(2n+0) {
    margin-top: 40px;
  }

  @media (max-width: 768px) {
    margin-left: 15px;
    margin-right: 15px;
  }

  .masonry-grid-column {
    margin-bottom: 40px;
    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
  }
}`

class VerticalMasonry extends React.Component {
    constructor(props) {
        super(props);
        this.reCalculateColumnCount = this.reCalculateColumnCount.bind(this);
        this.reCalculateColumnCountDebounce = this.reCalculateColumnCountDebounce.bind(this);

        let columnCount
        if (this.props.breakpointCols && this.props.breakpointCols.default) {
            columnCount = this.props.breakpointCols.default
        } else {
            columnCount = parseInt(this.props.breakpointCols) || DEFAULT_COLUMNS
        }
        this.state = {
            columnCount
        };
    }

    componentDidMount() {
        this.reCalculateColumnCount();

        // window may not be available in some environments
        if (window) {
            window.addEventListener('resize', this.reCalculateColumnCountDebounce);
        }
    }

    componentDidUpdate() {
        this.reCalculateColumnCount();
    }

    componentWillUnmount() {
        if (window) {
            window.removeEventListener('resize', this.reCalculateColumnCountDebounce);
        }
    }

    reCalculateColumnCountDebounce() {
        if (!window || !window.requestAnimationFrame) {
            this.reCalculateColumnCount();
            return;
        }

        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(this._lastRecalculateAnimationFrame);
        }

        this._lastRecalculateAnimationFrame = window.requestAnimationFrame(() => {
            this.reCalculateColumnCount();
        });
    }

    reCalculateColumnCount() {
        const windowWidth = window && window.innerWidth || Infinity;
        let breakpointColsObject = this.props.breakpointCols;

        // Allow passing a single number to `breakpointCols` instead of an object
        if (typeof breakpointColsObject !== 'object') {
            breakpointColsObject = {
                default: parseInt(breakpointColsObject) || DEFAULT_COLUMNS
            }
        }

        let matchedBreakpoint = Infinity;
        let columns = breakpointColsObject.default || DEFAULT_COLUMNS;

        for (let breakpoint in breakpointColsObject) {
            const optBreakpoint = parseInt(breakpoint);
            const isCurrentBreakpoint = optBreakpoint > 0 && windowWidth <= optBreakpoint;

            if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
                matchedBreakpoint = optBreakpoint;
                columns = breakpointColsObject[breakpoint];
            }
        }

        columns = Math.max(1, parseInt(columns) || 1);

        if (this.state.columnCount !== columns) {
            this.setState({
                columnCount: columns
            });

        }
        this.props.columnCount(columns)
    }

    itemsInColumns() {
        const currentColumnCount = this.state.columnCount;
        const itemsInColumns = new Array(currentColumnCount);

        // Force children to be handled as an array
        const items = React.Children.toArray(this.props.children)
        for (let i = 0; i < items.length; i++) {
            const columnIndex = i % currentColumnCount;

            if (!itemsInColumns[columnIndex]) {
                itemsInColumns[columnIndex] = [];
            }

            itemsInColumns[columnIndex].push(items[i]);
        }

        return itemsInColumns;
    }

    renderColumns() {
        const {column, columnAttrs = {}, columnClassName} = this.props;
        const childrenInColumns = this.itemsInColumns();
        const columnWidth = `${100 / childrenInColumns.length}%`;
        let className = columnClassName;

        if (className && typeof className !== 'string') {
            this.logDeprecated('The property "columnClassName" requires a string');

            if (typeof className === 'undefined') {
                className = 'masonry-grid-column';
            }
        }

        const columnAttributes = {
            ...column,
            ...columnAttrs,
            style: {
                ...columnAttrs.style,
                width: columnWidth,
                position: "relative",
            },
            className
        };
        return childrenInColumns.map((items, i) => {
            return <div
                {...columnAttributes}
                style={{...columnAttributes.style, marginLeft: i === 0 ? 0 : 20}}
                key={i}
            >
                {items}
            </div>;
        });
    }

    logDeprecated(message) {
        console.error('[Vertical]', message);
    }

    render() {
        const {
            // ignored
            children,
            breakpointCols,
            columnClassName,
            columnAttrs,
            column,

            // used
            className,

            ...rest
        } = this.props;

        let classNameOutput = className;

        if (typeof className !== 'string') {
            this.logDeprecated('The property "className" requires a string');

            // This is a deprecated default and will be removed soon.
            if (typeof className === 'undefined') {
                classNameOutput = 'my-masonry-grid';
            }
        }

        return (
            <Wrapper
                {...rest}
                className={classNameOutput}
            >
                {this.renderColumns()}
            </Wrapper>
        );
    }
}

VerticalMasonry.defaultProps = defaultProps;

export default VerticalMasonry;