import React from 'react';
import { MenuProvider } from 'react-contexify';


const Tr = (props) => (
    <MenuProvider id="menu_id" component="tr">
      {props.children}
    </MenuProvider>
  );

  export default Tr;