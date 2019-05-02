import React, {Component} from 'react';
import classes from './NavItems.module.css';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';


class NavItems extends Component {

    render() {
        // Чекбоксы с помощью которых пользователь выбирает какие колонки показывать
        // Колонки прячутся на уровне компонента Cell, если индекс Cell совпадает с одним из значений
        // в массиве hidingColumns , то к ней применяется стиль display: none
        const showColumnCheckboxes = this.props.headers.map((e, index) => 
                                                (<span className={classes.Navitems} key={"checkboxes" + index} style={{margin: '0 4px'}}>
                                                    <p style={{display: 'inline-block'}}>{e.value}</p>
                                                    <input 
                                                        defaultChecked
                                                        key={"checkBoxHide" + index}
                                                        type="checkbox"
                                                        name={e.value} 
                                                        onClick={() => this.props.hideColumn(index)}                                      
                                                    />
                                                </span>));

        return(
        
            <div className={classes.Header}>
            <div style={{display: 'inline-block'}}>
                {/* Кнопка для редактирования строк, доступна только тогда, когда хотя бы одна строка выбрана */}
                <button 
                    className={classes.Button} 
                    onClick={this.props.editingBegin} 
                    disabled={this.props.selectedRows.length === 0}
                > Edit selected rows
                </button>
                <button 
                    className={classes.Button} 
                    onClick={() => this.props.showURLFormBegin()}
                >Load new JSON
                </button>
            </div>
            <div style={{display: 'inline-block', float: 'right'}}>
                {showColumnCheckboxes}
            </div>
        </div>
        )
    }
        
};

const mapStateToProps = (state) => {
    return {
        selectedRows: state.selectedRows,
        headers: state.headers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editingBegin: () => dispatch(actions.editingBegin()),
        showURLFormBegin: () => dispatch(actions.showURLFormBegin()),
        hideColumn: (columnIndex) => dispatch(actions.hideColumn(columnIndex))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavItems);
