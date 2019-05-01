
const initialState = {
    wholeData: [],
    headers: [],
    dataToTable: [],
    selectedRows: [],
    editing: false,
    hidingColumns: [],
    isLoading: true,
    url: 'https://jsonplaceholder.typicode.com/albums'
};


const arrayFromJSON = (state, action) => {
    const first20RowData = action.initialData.slice(0, 20);
    return {
        ...state,
        headers: action.headers,
        wholeData: action.initialData,
        dataToTable: first20RowData
    }
};

const sortDataFunc = (state, action) => {
      const newData = [].concat(action.data);
            
      function compare(a, b) { 
          if (a.value[action.columnIndex] < b.value[action.columnIndex]) 
              return action.isAsc ? 1 : -1; 
          if (a.value[action.columnIndex] > b.value[action.columnIndex]) 
              return action.isAsc? -1 : 1; 
          return 0; 
      } 

      newData.sort(compare)

      return {
            ...state,
            headers: state.headers.map((e, i) => i === action.columnIndex ?
              {...e, asc: !action.isAsc} : e
            ),
            dataToTable: newData
        }
};

const filterHandler = (state, action) => {
    const newData = [].concat(action.data);
    for (let i = 0; i < newData.length; i++) {
      if(newData[i].value[action.columnIndex].toString().indexOf(action.event.target.value.toString()) < 0) {
        newData[i].show = false;
      } else {
        newData[i].show = true;
      }
    };

    return {
      ...state,
      dataToTable: newData
    }
};

const duplicateRow = (state, action) => {
      const newData = [].concat(state.dataToTable);
      const duplicateRow = {...newData[action.rowIndex]};
      newData.splice(action.rowIndex, 0, duplicateRow);
     
      return {
      ...state,
      dataToTable: newData
    }
};

const deleteRow = (state, action) => {
    const newData = [].concat(state.dataToTable);
    newData.splice(action.rowIndex, 1);
    
    return {
      ...state,
      dataToTable: newData
    }
};

const selectRowHandler = (state, action) => {
    const selectedRows = [].concat(state.selectedRows);
    const newData = [].concat(state.dataToTable);

    if(selectedRows.indexOf(action.rowIndex) === -1) {
      selectedRows.push(action.rowIndex);
      newData[action.rowIndex].selected = true;
    } else {
      let ind = selectedRows.findIndex(e => e === action.rowIndex);
      selectedRows.splice(ind, 1);
      newData[action.rowIndex].selected = false;
    }

    console.log(selectedRows)
    return {
      ...state,
      selectedRows: selectedRows,
      dataToTable: newData
    }
};

const editHandler = (state, action) => {
    const newData = [].concat(state.dataToTable);
    for (let i of state.selectedRows) {
        for (let key in action.updateData) {
          newData[i].value[key] = action.updateData[key];
          newData[i].selected = false;
        }
    }
    return {
      ...state,
      dataToTable: newData,
      selectedRows: []
    }
};

const editingCancel = (state) => {
    return {
      ...state,
      editing: false
    }
};

const editingBegin = (state) => {
    return {
      ...state,
      editing: true
    }
};

const editingContextMenu = (state, action) => {
    const singleRowNumber = [].concat(action.rowIndex);
    return {
      ...state,
      editing: true,
      selectedRows: singleRowNumber
    }
};

const hideColumn = (state, action) => {
      const newArr = [].concat(state.hidingColumns);

      if(newArr.indexOf(action.columnIndex) === -1) {
        newArr.push(action.columnIndex);
      } else {
        let ind = newArr.findIndex(e => e === action.columnIndex);
        newArr.splice(ind, 1);
      }
      console.log(newArr);
      return {
        ...state,
        hidingColumns: newArr
      }
};

const loadMoreRows = (state) => {
  if (state.dataToTable.length >= state.wholeData.length && state.dataToTable.length !== 0) {
        console.log('End of the rows!')
        return {
          ...state,
          isLoading: false
        }
  } else if (state.dataToTable.length === 0) {
        console.log("Loading page")
  } else {
        console.log('Loading rows')
        const newPartOfRows = state.wholeData.slice(state.dataToTable.length, state.dataToTable.length + 15);
        const newDataToTable = [...state.dataToTable].concat(newPartOfRows);
        return {
          ...state,
          dataToTable: newDataToTable
        }
  } 
};

const reducer = (state = initialState, action) => {
        switch(action.type) {
            case "DATATOREDUCER" : return arrayFromJSON(state, action);
            case "SORTDATA" : return sortDataFunc(state, action);
            case "FILTER_HANDLER" : return filterHandler(state, action);
            case "DUPLICATE_ROW" : return duplicateRow(state, action);
            case "DELETE_ROW" : return deleteRow(state, action);
            case "SELECT_ROW" : return selectRowHandler(state, action);
            case "EDIT_HANDLER" : return editHandler(state, action);
            case "EDITING_CANCEL" : return editingCancel(state, action);
            case "EDITING_BEGIN" : return editingBegin(state, action);
            case "EDITING_CONTEXT_MENU" : return editingContextMenu(state, action);
            case "HIDE_COLUMN" : return hideColumn(state, action);
            case "LOAD_MORE_ROWS" : return loadMoreRows(state);
            default: return state;
        }
};

export default reducer;