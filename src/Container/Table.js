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


class Table extends Component {

    tableTable = React.createRef();

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

    droppableHandler = () => {
        const el = this.tableTable.current;
        const dragger = tableDragger(el, {
         mode: 'column',
         onlyBody: true,
         animation: 300
       });
       dragger.on('drop',function(from, to){
       });
    };    
    
    componentDidMount () {
        this.props.getDataJSON(this.props.url);
    };

    componentDidUpdate () {
        this.droppableHandler();
    };
   
    render() {
        const checkboxes = this.props.headers.map((e, index) => 
                                                (<span key={"checkboxes" + index} style={{margin: '0 4px'}}>
                                                    <p style={{display: 'inline-block'}}>{e.value}</p>
                                                    <input 
                                                        defaultChecked
                                                        key={"checkBoxHide" + index}
                                                        type="checkbox"
                                                        name={e.value} 
                                                        onClick={() => this.props.hideColumn(index)}                                      
                                                                />
                                                </span>))


        const headers = this.props.headers.map((e, index) => <Cell 
                                                                style={{textAlign: 'center'}}
                                                                key={"heading" + index} 
                                                                content={e.value}
                                                                index={index}
                                                                click={() => this.props.sortDataHandler(index, this.props.dataToTable, e.asc)} 
                                                                header />);

        const inputs = (<tr key={'inputs'}>{this.props.headers.map((e, index) => {
            return (<Cell key={'inputsCell' + index} index={index}><Input key={'input' + index} change={(event) => this.props.filterHandler(event, index, this.props.dataToTable)} /></Cell>)
        })}</tr>)
    
        const rows = this.props.dataToTable.map((e, rowIndex) => {
          return (<tr key={'tr' + rowIndex} className={e.show ? (e.selected ? classes.Selected : null) : classes.Display} onClick={() => this.props.selectRowHandler(rowIndex)} onContextMenu={(event) => this.handleContextMenu(event, rowIndex)}>
                            {e.value.map((cell, index) => {
                                return (<Cell key={'cell' + index} index={index} content={cell} />)
                            })}
                    </tr>)
                        });


        return (
            <React.Fragment>
                <Modal showEditing={this.props.editing} closeEditing={this.props.editingCancel}>
                    <EditingForm close={this.props.editingCancel}/>
                </Modal>
                    <div className={classes.Header}>
                        <div style={{display: 'inline-block'}}>
                            <button className={classes.Button} onClick={this.props.editingBegin} disabled={this.props.selectedRows.length === 0} >Edit selected rows</button>
                            <button className={classes.Button} onClick={() => this.props.loadMoreRows()}>Load more data</button>
                        </div>
                        <div style={{display: 'inline-block', float: 'right'}}>
                        {checkboxes}
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
                        <ContextMenu />
                    </tbody>
                </table>
                
                {this.props.isLoading ? <Waypoint onEnter={() => this.props.loadMoreRows()}/> : null}
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
        url: state.url
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
        loadMoreRows: () => dispatch(actions.loadMoreRows())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);