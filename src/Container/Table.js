import React, {Component} from 'react';
import Cell from '../Components/Cell/Cell';
import Input from '../Components/Input/Input';
import Modal from '../Components/UI/Modal/Modal';
import EditingForm from '../Components/EditingForm/EditingForm';
import tableDragger from 'table-dragger';
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

    // Модуль перетаскивания колонок
    droppableHandler = () => {
        const el = this.tableTable.current;
        const dragger = tableDragger(el, {
         mode: 'column',
         onlyBody: true,
         animation: 300
       });
    //    const changeIndexesInRedux = this.props.changeColumnIndex;

       dragger.on('drop',function(from, to){
            // changeIndexesInRedux(from, to);
        });
    };    

    componentDidMount () {
        // Загрузка данных по заранее указанному адресу
        this.props.getDataJSON(this.props.url);
    };

    componentDidUpdate () {
        // Модуль перетаскивания колонок
        this.droppableHandler();
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

        // Заголовки таблицы
        const headers = this.props.headers.map((e, index) => <Cell 
                                                                style={{textAlign: 'center'}}
                                                                key={"heading" + index} 
                                                                content={e.value}
                                                                index={index}
                                                                click={() => this.props.sortDataHandler(index, this.props.dataToTable, e.asc)} 
                                                                header 
                                                            />);

        // Поля по которым пользователь делает фильтрацию
        const inputs = <tr key={'inputs'}>
                            {this.props.headers.map((e, index) => {
                                    return (<Cell key={'inputsCell' + index} index={index}>
                                                    <Input 
                                                        key={'input' + index} 
                                                        change={(event) => this.props.filterHandler(event, index, this.props.dataToTable)} 
                                                    />
                                            </Cell>)
                            })}
                        </tr>
        
        // Строки таблицы 
        const rows = this.props.dataToTable.map((e, rowIndex) => {
                            return (
                                <tr 
                                    key={'tr' + rowIndex} 
                                    className={e.show ? 
                                                    (e.selected ? classes.Selected : null) 
                                                    : classes.Display} 
                                    onClick={() => this.props.selectRowHandler(rowIndex)} 
                                    onContextMenu={(event) => this.handleContextMenu(event, rowIndex)}
                                >
                                    {e.value.map((cell, index) => {
                                        return (<Cell key={'cell' + index} index={index} content={cell} />)
                                    })}
                                </tr>)
                        });


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
                    <thead>
                        <tr key={"headerRow"} >
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {inputs}
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
        // changeColumnIndex: (oldIndex, newIndex) => dispatch(actions.changeColumnIndex(oldIndex, newIndex))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);