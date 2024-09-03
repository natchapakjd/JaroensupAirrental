import React from 'react'

const Header = () => {
  return (
    <div><div class="grid grid-cols-2 mx-5 mt-8">
    <div >
        <p class="text-xl ml-11 font-semibold">Hello, admin</p>
        <p class="text-sm text-gray-600 ml-11 font-normal">Have a nice day</p>
    </div>
    <div class="flex justify-end">
        {/* <img class="w-5 h-6 flex mr-6 mt-3" src="../../../assets/icons/mdi_bell-badge.png" alt="bell"> */}
        <div class="border border-l-6 h-full bg-gray-600 mr-6"></div>
        <span class="h-12 w-12 bg-gray-500 border rounded-full  inline-block mr-5"></span>
        <div class="flex relative" >
            <div> 
                <p class="text-base font-semibold">admin admin</p>
                <p class="text-xs font-normal	">admin</p>
            </div>
            {/* <img  class="w-5 h-6 ml-2 mt-1" src="../../../assets/icons/mdi_chevron-down.png" alt=""> */}
            {/* @if(isToggle){
                <div class="absolute top-12 bg-white w-full h-full border rounded-md mx-auto">
                    <ul class="text-center">
                        <li class="hover:bg-gray-100"><a class="text-sm " routerLink="/" (click)="logout()">Sign out</a></li>
                    </ul>
                    <ul class="text-center">
                        <li class="hover:bg-gray-100"><a class="text-sm " >Lorem</a></li>
                    </ul>
                   
                </div>
            } */}
        </div>
       
    </div>
   
        
  
</div></div>
  )
}

export default Header