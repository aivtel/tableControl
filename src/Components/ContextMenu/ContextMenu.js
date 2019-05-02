import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css'; 
import {connect} from 'react-redux';
import * as actions from '../../store/actions';

const ContextMenu = (props) => (
   <Menu id='menu_id'>
       <Item onClick={(data) => props.duplicateRow(data)}>
           Дублировать строку
       </Item>
       <Separator />
       <Item onClick={(data) => props.editingContextMenu(data)}>
           Изменить строку
       </Item>
       <Item onClick={(data) => props.deleteRow(data)}>
           Удалить строку
       </Item>
   </Menu>
);
   
const mapDispatchToProps = (dispatch) => {
    return {
        duplicateRow: (data) => dispatch(actions.duplicateRow(data)),
        deleteRow: (data) => dispatch(actions.deleteRow(data)),
        editingContextMenu: (data) => dispatch(actions.editingContextMenu(data))
    }
};

export default connect(null, mapDispatchToProps)(ContextMenu);