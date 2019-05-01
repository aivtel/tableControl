import axios from 'axios';

export const getDataJSON = (url) => {
    return (dispatch) => {
        axios.get(url)
            .then(res => {
                const dataArray = res.data.map((e) => ({
                        show: true,
                        selected: false,
                        value: Object.values(e)
                    }));
              
                const headersArray = Object.keys(res.data[0]).map((e) => ({
                    asc: true,
                    value: e
                }));
                
                dispatch(dataToReducer(dataArray, headersArray))
            })
            .catch(err => console.log(err));
    }
};

export const dataToReducer = (data, headers) => {
    return {
        type: "DATATOREDUCER",
        initialData: data,
        headers: headers
    }
};


export const sortDataHandler = (columnIndex, data, isAsc) => {
    return {
        type: "SORTDATA",
        data: data,
        columnIndex: columnIndex,
        isAsc: isAsc
    }
};

export const filterHandler = (event, columnIndex, data) => {
    return {
        type: "FILTER_HANDLER",
        event: event,
        columnIndex: columnIndex,
        data: data
    }
};

export const duplicateRow = (data) => {
    return {
        type: "DUPLICATE_ROW",
        rowIndex: data.props.rowIndex
    }
};

export const deleteRow = (data) => {
    return {
        type: "DELETE_ROW",
        rowIndex: data.props.rowIndex
    }
};

export const selectRowHandler = (rowIndex) => {
    return {
        type: "SELECT_ROW",
        rowIndex: rowIndex
    }
};

export const editHandler = (updateData) => {
    return {
        type: "EDIT_HANDLER",
        updateData: updateData
    }
};

export const editingCancel = () => {
    return {
        type: "EDITING_CANCEL"
    }
};

export const editingBegin = () => {
    return {
        type: "EDITING_BEGIN"
    }
};

export const editingContextMenu = (data) => {
    return {
        type: "EDITING_CONTEXT_MENU",
        rowIndex: data.props.rowIndex
    }
};

export const hideColumn = (columnIndex) => {
    return {
        type: "HIDE_COLUMN",
        columnIndex: columnIndex
    }
};

export const loadMoreRows = () => {
    return {
        type: "LOAD_MORE_ROWS"
    }
};