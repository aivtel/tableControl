// headers и dataToTable имеют первоначальные значения? чтобы при первом рендере до загрузки json 
// сайт не выдавал ошибку.
// На PC работает и без этого, а с телефона выдает ошибку
const initialState = {
    wholeData: [],
    headers: [{asc: true, value: "Loading"}],
    dataToTable: [{selected: false,
      show: true,
      value: [null, null, " initialData"]}],
    selectedRows: [],
    editing: false,
    hidingColumns: [],
    isLoading: true,
    url: 'https://jsonplaceholder.typicode.com/albums',
    showURLForm: false,
    fetchedData: false
};

// Обновления state после получение JSON data через axios
const arrayFromJSON = (state, action) => {
    const first20RowData = action.initialData.slice(0, 20);
    return {
        ...state,
        headers: action.headers,
        wholeData: action.initialData,
        dataToTable: first20RowData,
        fetchedData: true
    }
};

// Сортировка по клику по заголовку
const sortDataFunc = (state, action) => {
      const newData = [...action.data];
    
      // isAsc  - значение в объекте заголовка, указывающее сортировать по возрастанию или нет 
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

// Фильтрация по совпадению, если не совпадает, значение show устанавливает в false и применяется стиль display:none
const filterHandler = (state, action) => {
    const newData = [...action.data];
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

// Дублируем строку из команды контекстного меню
const duplicateRow = (state, action) => {
      const newData = [...state.dataToTable];
      const duplicateRow = {...newData[action.rowIndex]};
      newData.splice(action.rowIndex, 0, duplicateRow);
     
      return {
      ...state,
      dataToTable: newData
    }
};

// Удаляем строку командой из контекстного меню
const deleteRow = (state, action) => {
    const newData = [...state.dataToTable];
    newData.splice(action.rowIndex, 1);
    
    return {
      ...state,
      dataToTable: newData
    }
};

// Выбарнные строки помечаются булеаном selected и их индекс добавляется в специальный массив
//  чтобы затем применить стиль 
// и чтобы только они были доступны для редактирования из формы редактирования
const selectRowHandler = (state, action) => {
    const selectedRows = [...state.selectedRows];
    const newData = [...state.dataToTable];

    if(selectedRows.indexOf(action.rowIndex) === -1) {
      selectedRows.push(action.rowIndex);
      newData[action.rowIndex].selected = true;
    } else {
      let ind = selectedRows.findIndex(e => e === action.rowIndex);
      selectedRows.splice(ind, 1);
      newData[action.rowIndex].selected = false;
    }

    return {
      ...state,
      selectedRows: selectedRows,
      dataToTable: newData
    }
};

// Редактируем выбранные строки, прогоняя по массиву с номерами индексов выбранных строк
// Меняем значение объекта исходя из его key 
const editHandler = (state, action) => {
    const newData = [...state.dataToTable];
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

// Отмена показы формы - по клику по затемненному фону
const editingCancel = (state) => {
    return {
      ...state,
      editing: false
    }
};

// Показываем форму редактирования
const editingBegin = (state) => {
    return {
      ...state,
      editing: true
    }
};

// Отменям форму загрузки нового JSON
const showURLFormCancel = (state) => {
    return {
      ...state,
      showURLForm: false
    }
};

// Показываем форму загрузки JSON
const showURLFormBegin = (state) => {
    return {
      ...state,
      showURLForm: true
    }
};

// Если мы нажимаем изменить строку из контекстного меню
// то только эта строка становится доступной для редактирования
//  - в массив редактируемых строк добавляется одна она
const editingContextMenu = (state, action) => {
    const singleRowNumber = [].concat(action.rowIndex);
    return {
      ...state,
      editing: true,
      selectedRows: singleRowNumber
    }
};

// Прячем колонки по индексу
const hideColumn = (state, action) => {
      const newArr = [...state.hidingColumns];

      if(newArr.indexOf(action.columnIndex) === -1) {
        newArr.push(action.columnIndex);
      } else {
        let ind = newArr.findIndex(e => e === action.columnIndex);
        newArr.splice(ind, 1);
      }
      return {
        ...state,
        hidingColumns: newArr
      }
};

// Добавляем новые строки при прокрутке.
const loadMoreRows = (state) => {
  if (state.dataToTable.length >= state.wholeData.length && state.dataToTable.length !== 0) {
        return {
          ...state,
          isLoading: false
        }
  } else if (state.dataToTable.length === 0) {
  } else {
        const newData = [...state.wholeData];
        const newCurrentRows = newData.slice(0, state.dataToTable.length);
        const newPartOfRows = state.wholeData.slice(state.dataToTable.length, state.dataToTable.length + 15);
        const newDataToTable = newCurrentRows.concat(newPartOfRows);
        
        return {
          ...state,
          dataToTable: newDataToTable
        }
  } 
};

// Кнопки чередования колонок над заголовками меняют индексы в массиве данных и в заголовках
const changeColumnIndex = (state, action) => {
    const newData = [...state.wholeData];
    const newHeaders = [...state.headers];
    const headersValue = state.headers.find((el, index) => index === action.oldIndex);
    newHeaders.splice(action.oldIndex, 1);
    newHeaders.splice(action.newIndex, 0, headersValue);
    for (let i = 0; i < newData.length; i++) {
      const value = state.wholeData[i].value.find((el, index) => index === action.oldIndex);
      newData[i].value.splice(action.oldIndex, 1);
      newData[i].value.splice(action.newIndex, 0, value);
    }
    return {
      ...state,
      wholeData: newData,
      headers: newHeaders
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
            case "SHOW_URL_FORM_CANCEL": return showURLFormCancel(state, action);
            case "SHOW_URL_FORM_BEGIN": return showURLFormBegin(state, action);
            case "CHANGE_COLUMN_INDEX": return changeColumnIndex(state, action);
            default: return state;
        }
};

export default reducer;