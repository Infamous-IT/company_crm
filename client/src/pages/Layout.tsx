import {FC} from 'react';
import {Outlet} from 'react-router-dom';
import WrapperMenu from '../components/WrapperMenu.tsx';
const Layout:FC = () => {
  return (
      <div>
          <WrapperMenu>
              <div className="container">
                  <Outlet />
              </div>
          </WrapperMenu>
      </div>
    // <div className='min-h-screen bg-slate-900 pb-20 font-roboto text-white'>
    //   <WrapperMenu/>
    //   <div className='container'>
    //     <Outlet/>
    //   </div>
    // </div>
  )
}

export default Layout;