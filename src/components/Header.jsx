import React from 'react'

const Header = () => {
  return (
    <div><div className="grid grid-cols-2 mx-5 mt-8">
    <div >
        <p className="text-xl ml-11 font-semibold">Hello, admin</p>
        <p className="text-sm text-gray-600 ml-11 font-normal">Have a nice day</p>
    </div>
    <div className="flex justify-end">
        {/* <img className="w-5 h-6 flex mr-6 mt-3" src="../../../assets/icons/mdi_bell-badge.png" alt="bell"> */}
        <div className="border border-l-6 h-full bg-gray-600 mr-6"></div>
        <span className="h-12 w-12 bg-gray-500 border rounded-full  inline-block mr-5"></span>
        <div className="flex relative" >
            <div> 
                <p className="text-base font-semibold">admin admin</p>
                <p className="text-xs font-normal	">admin</p>
            </div>
            {/* <img  className="w-5 h-6 ml-2 mt-1" src="../../../assets/icons/mdi_chevron-down.png" alt=""> */}
            {/* @if(isToggle){
                <div className="absolute top-12 bg-white w-full h-full border rounded-md mx-auto">
                    <ul className="text-center">
                        <li className="hover:bg-gray-100"><a className="text-sm " routerLink="/" (click)="logout()">Sign out</a></li>
                    </ul>
                    <ul className="text-center">
                        <li className="hover:bg-gray-100"><a className="text-sm " >Lorem</a></li>
                    </ul>
                   
                </div>
            } */}
        </div>
       
    </div>
   
        
  
</div></div>
  )
}

export default Header