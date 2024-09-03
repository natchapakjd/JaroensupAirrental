import React from "react";
import { AiFillDashboard } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div>
      <aside class="w-64 h-screen sticky top-0 border bg-gray-100">
        <div class="relative">
          <p class="text-xl font-bold mt-8 ml-10 mr-26 mb-14 text-black">
            Jaroensup
          </p>
          <div class="flex flex-col  w-full ">
            <ul class="flex flex-col  ml-10 mb-16">
              <li class="mb-8 ">
                <a class="text-base font-semibold"></a>
              </li>

              <li class="mb-8">
                <a class="text-base font-semibold">
                  <div class="flex">
                    {/* <AiFillDashboard className="mt-1" />  */}Dashboard
                  </div>
                </a>
              </li>

              <li class="mb-8">
                <a class="text-base   font-semibold">  Users</a>
              </li>
              <li class="mb-8">
                <a class="text-base  font-semibold">
                  <div class="flex">Tasks</div>
                </a>
              </li>
              <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Categories</div>
                </a>
              </li>
            </ul>

            <ul class="flex flex-col ml-10 mb-16">
              <li class="mb-8">
                <a class="text-base  font-semibold">
                  <div class="flex">WareHouse</div>
                </a>
              </li>
              <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Product</div>
                </a>
              </li>
              <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Profile</div>
                </a>
              </li>
              <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Report</div>
                </a>
              </li>
              <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Guide Book</div>
                </a>
              </li>
              
            </ul>

            <ul class="flex flex-col ml-10">
            <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Setting</div>
                </a>
              </li>
              <li class="mb-8">
                <a class="text-base   font-semibold">
                  <div class="flex">Logout</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
