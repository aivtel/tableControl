import React, {Component} from 'react';
import classes from './Cell.module.css';
import { connect } from 'react-redux';

class Cell extends Component {
    render() {
        const cellType = this.props.header ? 
                            <th className={this.props.hidingColumns.includes(this.props.index) ? 
                                                classes.Hide 
                                                : 
                                                classes.CellHeader} 
                                onClick={this.props.click}> 
                                    {this.props.content} {this.props.children}
                            </th>
                            : 
                            <td className={this.props.hidingColumns.includes(this.props.index) ? 
                                                classes.Hide 
                                                : 
                                                classes.Cell}>
                                    {this.props.content} {this.props.children}
                            </td>
                        
        return cellType
    }
};

const mapStateToProps = (state) => {
    return {
        hidingColumns: state.hidingColumns
    }
};

export default connect(mapStateToProps)(Cell);