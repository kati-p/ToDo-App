import React from 'react';
import { slide as Menu } from 'react-burger-menu';

export default function SideBar(props) {

     /* react-burger-menu: https://www.npmjs.com/package/react-burger-menu */
     var menuStyle = {
          bmBurgerButton: {
               position: 'absolute',
               width: '36px',
               height: '30px',
               left: '36px',
               top: '36px'
          },
          bmBurgerBars: {
               background: '#F5F5F5'
          },
          bmBurgerBarsHover: {
               background: '#a90000'
          },
          bmCrossButton: {
               height: '24px',
               width: '24px'
          },
          bmCross: {
               background: '#bdc3c7',
               right: '10px'
          },
          bmMenuWrap: {
               position: 'fixed',
               height: '100%',
          },
          bmMenu: {
               background: '#373a47',
               padding: '2.5em 1.5em 0',
               fontSize: '1.15em'
          },
          bmMorphShape: {
               fill: '#373a47'
          },
          bmItemList: {
               color: '#b8b7ad',
               padding: '0.8em'
          },
          bmItem: {
               display: 'inline-block'
          },
          bmOverlay: {
               background: 'rgba(0, 0, 0, 0.3)'
          }
     }

     return (
          <div>
               <Menu props={props} styles={menuStyle}>
                    <br/>
                    <a style={{color:'rgb(184, 183, 173)', textDecoration:'none'}} href='/main'>Main</a>
                    <br/>
                    <br/>
                    <a style={{color:'rgb(184, 183, 173)', textDecoration:'none'}} href='/credit'>Credit</a>
                    <br/>
                    <br/>
                    <a style={{color:'rgb(184, 183, 173)', textDecoration:'none'}} href='/signout'>Sign out</a>
               </Menu>
          </div>
     )
}
