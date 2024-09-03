import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white text-black h-screen font-prompt">
        <div className="bg-blue h-20 mb-5">
          <p className="text-white text-3xl py-6 text-center ">ติดต่อเรา</p>
        </div>
        <iframe
          className="w-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247943.07805996135!2d100.51583909225876!3d13.8323970412977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e299bca25f00d9%3A0xf1b3210b3bd61a2!2sPN%20MAP!5e0!3m2!1sth!2sth!4v1724387269578!5m2!1sth!2sth"
          width="600"
          height="350"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
              <p>บริษัท ...จำกัด</p>
              <p>เลขที่ 51 ซ.สุขาภิบาล5 ซอย5 แยก22 แขวงท่าแร้ง เขตบางเขน กรุงเทพฯ 10220</p>
              <p>ช่องทางการติดต่อ</p>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
