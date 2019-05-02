import React, {Component} from 'react';
import Cell from '../Components/Cell/Cell';
import Input from '../Components/Input/Input';
import Modal from '../Components/UI/Modal/Modal';
import EditingForm from '../Components/EditingForm/EditingForm';
import classes from './Table.module.css';
import {connect} from 'react-redux';
import * as actions from '../store/actions';
import ContextMenu from '../Components/ContextMenu/ContextMenu';
import { contextMenu } from 'react-contexify';
import {Waypoint} from 'react-waypoint';
import JSONForm from '../Components/JSONForm/JSONForm';

class Table extends Component {
    // реф вместо id, чтобы модулю для перетаскивания колонок в таблице было понятно с каким объектом работать
    tableTable = React.createRef();

    // Модуль контекстного меню
    handleContextMenu(e, rowindex) {
        e.preventDefault();
        contextMenu.show({
            id: 'menu_id',
            event: e,
            props: {
                rowIndex: rowindex
            }
          })
    };

    componentDidMount () {
        // Загрузка данных по заранее указанному адресу
        this.props.getDataJSON(this.props.url);
    };
   
    render() {
        // Чекбоксы с помощью которых пользователь выбирает какие колонки показывать
        // Колонки прячутся на уровне компонента Cell, если индекс Cell совпадает с одним из значений
        // в массиве hidingColumns , то к ней применяется стиль display: none
        const showColumnCheckboxes = this.props.headers.map((e, index) => 
                                                (<span key={"checkboxes" + index} style={{margin: '0 4px'}}>
                                                    <p style={{display: 'inline-block'}}>{e.value}</p>
                                                    <input 
                                                        defaultChecked
                                                        key={"checkBoxHide" + index}
                                                        type="checkbox"
                                                        name={e.value} 
                                                        onClick={() => this.props.hideColumn(index)}                                      
                                                    />
                                                </span>));

        // Кнопки перемещения колонок таблицы 
        const ChangeColumnsOrderButtons = this.props.headers.map((e, index) => 
                                    <Cell key={"headingBtn" + index} header>
                                        <button 
                                            disabled={index === 0}
                                            className={classes.ButtonOrder}
                                            onClick={() => this.props.changeColumnIndex(index, index - 1)}
                                        > &lt; {e.value} </button>
                                        <button 
                                            disabled={index === this.props.headers.length - 1}
                                            className={classes.ButtonOrder}
                                            onClick={() => this.props.changeColumnIndex(index, index + 1)}
                                        >{e.value} &gt;</button>
                                    </Cell>);

        // Заголовки таблицы
        const headers = this.props.headers.map((e, index) => 
                                    <Cell 
                                        style={{textAlign: 'center'}}
                                        key={"heading" + index} 
                                        content={e.value}
                                        index={index}
                                        click={() => 
                                            this.props.sortDataHandler(index, this.props.dataToTable, e.asc)} 
                                        header 
                                    />);

        // Поля по которым пользователь делает фильтрацию
        const inputs = this.props.headers.map((e, index) => 
                                    <Cell key={'inputsCell' + index} index={index} header>
                                        <Input 
                                            key={'input' + index} 
                                            change={(event) => this.props.filterHandler(event, index, this.props.dataToTable)} 
                                        />
                                    </Cell>)
        
        // Строки таблицы 
        const rows = this.props.dataToTable.map((e, rowIndex) =>
                                <tr 
                                    key={'tr' + rowIndex} 
                                    className={e.show ? 
                                                    (e.selected ? classes.Selected : null) 
                                                    : classes.Display} 
                                    onClick={() => this.props.selectRowHandler(rowIndex)} 
                                    onContextMenu={(event) => this.handleContextMenu(event, rowIndex)}
                                >
                                    {e.value.map((cell, index) => 
                                        <Cell key={'cell' + index} index={index} content={cell} />)}
                                </tr>);


        return (
            <React.Fragment>
                {/* Modal это всплывающее поле с формой для редактирования строк или с формой ввода нового URL данных */}
                <Modal showEditing={this.props.editing} closeEditing={this.props.editingCancel}>
                    <EditingForm close={this.props.editingCancel}/>
                </Modal>
                <Modal showEditing={this.props.showURLForm} closeEditing={this.props.showURLFormCancel}>
                    <JSONForm close={this.props.showURLFormCancel}/>
                </Modal>
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
                <table ref={this.tableTable} className={classes.Table}>
                    <thead className={classes.TableHead}>
                        <tr key={"orderBtn"}>{ChangeColumnsOrderButtons}</tr>
                        <tr key={"headerRow"}>{headers}</tr>
                        <tr key={"headerinputs"}>{inputs}</tr>
                    </thead>
                    <tbody className={classes.TableBody}>   
                        {rows}   
                        {/* Ниже модуль контекстного меню */}
                        <ContextMenu />
                    </tbody>
                </table>
                {/* Ниже модуль, который загружает строки при прокрутке */}
                {this.props.fetchedData ? (this.props.isLoading ? <Waypoint onEnter={() => this.props.loadMoreRows()}/> : null) : null}
            </React.Fragment>
            )
    }
};

const mapStateToProps = (state) => {
    return {
        headers: state.headers,
        dataToTable: state.dataToTable,
        editing: state.editing,
        selectedRows: state.selectedRows,
        hidingColumns: state.hidingColumns,
        isLoading: state.isLoading,
        url: state.url,
        showURLForm: state.showURLForm,
        fetchedData: state.fetchedData
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDataJSON: (url) => dispatch(actions.getDataJSON(url)),
        sortDataHandler: (index, data, isAsc) => dispatch(actions.sortDataHandler(index, data, isAsc)),
        filterHandler: (event, index, data) => dispatch(actions.filterHandler(event, index, data)),
        selectRowHandler: (rowIndex) => dispatch(actions.selectRowHandler(rowIndex)),
        editingCancel: () => dispatch(actions.editingCancel()),
        editingBegin: () => dispatch(actions.editingBegin()),
        hideColumn: (columnIndex) => dispatch(actions.hideColumn(columnIndex)),
        loadMoreRows: () => dispatch(actions.loadMoreRows()),
        showURLFormBegin: () => dispatch(actions.showURLFormBegin()),
        showURLFormCancel: () => dispatch(actions.showURLFormCancel()),
        changeColumnIndex: (oldIndex, newIndex) => dispatch(actions.changeColumnIndex(oldIndex, newIndex))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);