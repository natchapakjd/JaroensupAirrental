import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const Home = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="carousel w-full ">
          <div className="carousel  mx-auto">
            <div id="slide1" className="carousel-item relative w-full">
              <img
                src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
                className="w-full"
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href="#slide4"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❮
                </a>
                <a
                  href="#slide2"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❯
                </a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <img
                src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
                className="w-full"
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href="#slide1"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❮
                </a>
                <a
                  href="#slide3"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❯
                </a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <img
                src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
                className="w-full"
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href="#slide2"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❮
                </a>
                <a
                  href="#slide4"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❯
                </a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
              <img
                src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
                className="w-full"
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href="#slide3"
                  className="btn btn-circle bg-white text-black border-none hover:bg-black hover:text-white"
                >
                  ❮
                </a>
                <a
                  href="#slide1"
                  className="btn btn-circle bg-white  text-black border-none hover:bg-black hover:text-white"
                >
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
      

       
        <p className="text-2xl font-prompt  my-4 md: text-center text-black">
          หมวดหมู่สินค้า
        </p>
        <div className="grid grid-cols-1  font-prompt  mx-auto md:grid-cols-3 md:w-2/3">
          <div className="card card-compact bg-white text-black w-96 shadow-xl  my-5 mx-auto ">
            <figure>
              <img
                src="https://media.istockphoto.com/id/1855055935/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8.jpg?s=2048x2048&w=is&k=20&c=jYBp-ZI9Eo4dgP_6V76aQGGzWl__6IYTVtbRUzgWPnc="
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">เช่าพัดลมไอเย็น</h2>
              <p>
                บริการพัดลมไอเย็นให้เช่า ช่วยลดความร้อนในอากาศอย่างรวดเร็ว
                ใช้งานง่าย สร้างลมเย็นให้กับพื้นที่จัดงานได้ดี มาสเตอร์คูล
                มีพัดลมไอเย็นให้เช่า หรือพัดลมแอร์ให้เลือกใช้งานหลายขนาด
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary bg-white border-none text-black hover:bg-blue hover:text-white">
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            </div>
          </div>
          <div className="card card-compact bg-white text-black w-96 shadow-xl  my-5 mx-auto">
            <figure>
              <img
                src="https://media.istockphoto.com/id/1855055935/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8.jpg?s=2048x2048&w=is&k=20&c=jYBp-ZI9Eo4dgP_6V76aQGGzWl__6IYTVtbRUzgWPnc="
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">เช่าพัดลมไอเย็น</h2>
              <p>
                บริการพัดลมไอเย็นให้เช่า ช่วยลดความร้อนในอากาศอย่างรวดเร็ว
                ใช้งานง่าย สร้างลมเย็นให้กับพื้นที่จัดงานได้ดี มาสเตอร์คูล
                มีพัดลมไอเย็นให้เช่า หรือพัดลมแอร์ให้เลือกใช้งานหลายขนาด
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary bg-white border-none text-black hover:bg-blue hover:text-white">
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            </div>
          </div>
          <div className="card card-compact bg-white text-black w-96 shadow-xl  my-5 mx-auto">
            <figure>
              <img
                src="https://media.istockphoto.com/id/1855055935/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8.jpg?s=2048x2048&w=is&k=20&c=jYBp-ZI9Eo4dgP_6V76aQGGzWl__6IYTVtbRUzgWPnc="
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">เช่าพัดลมไอเย็น</h2>
              <p>
                บริการพัดลมไอเย็นให้เช่า ช่วยลดความร้อนในอากาศอย่างรวดเร็ว
                ใช้งานง่าย สร้างลมเย็นให้กับพื้นที่จัดงานได้ดี มาสเตอร์คูล
                มีพัดลมไอเย็นให้เช่า หรือพัดลมแอร์ให้เลือกใช้งานหลายขนาด
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary bg-white border-none text-black hover:bg-blue hover:text-white">
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            </div>
          </div>
          <div className="card card-compact bg-white text-black w-96 shadow-xl  my-5 mx-auto">
            <figure>
              <img
                src="https://media.istockphoto.com/id/1855055935/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8.jpg?s=2048x2048&w=is&k=20&c=jYBp-ZI9Eo4dgP_6V76aQGGzWl__6IYTVtbRUzgWPnc="
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">เช่าพัดลมไอเย็น</h2>
              <p>
                บริการพัดลมไอเย็นให้เช่า ช่วยลดความร้อนในอากาศอย่างรวดเร็ว
                ใช้งานง่าย สร้างลมเย็นให้กับพื้นที่จัดงานได้ดี มาสเตอร์คูล
                มีพัดลมไอเย็นให้เช่า หรือพัดลมแอร์ให้เลือกใช้งานหลายขนาด
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary bg-white border-none text-black hover:bg-blue hover:text-white">
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            </div>
          </div>
          <div className="card card-compact bg-white text-black w-96 shadow-xl  my-5 mx-auto">
            <figure>
              <img
                src="https://media.istockphoto.com/id/1855055935/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8.jpg?s=2048x2048&w=is&k=20&c=jYBp-ZI9Eo4dgP_6V76aQGGzWl__6IYTVtbRUzgWPnc="
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">เช่าพัดลมไอเย็น</h2>
              <p>
                บริการพัดลมไอเย็นให้เช่า ช่วยลดความร้อนในอากาศอย่างรวดเร็ว
                ใช้งานง่าย สร้างลมเย็นให้กับพื้นที่จัดงานได้ดี มาสเตอร์คูล
                มีพัดลมไอเย็นให้เช่า หรือพัดลมแอร์ให้เลือกใช้งานหลายขนาด
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary bg-white border-none text-black hover:bg-blue hover:text-white">
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            </div>
          </div>
          <div className="card card-compact bg-white text-black w-96 shadow-xl  my-5 mx-auto">
            <figure>
              <img
                src="https://media.istockphoto.com/id/1855055935/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8.jpg?s=2048x2048&w=is&k=20&c=jYBp-ZI9Eo4dgP_6V76aQGGzWl__6IYTVtbRUzgWPnc="
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">เช่าพัดลมไอเย็น</h2>
              <p>
                บริการพัดลมไอเย็นให้เช่า ช่วยลดความร้อนในอากาศอย่างรวดเร็ว
                ใช้งานง่าย สร้างลมเย็นให้กับพื้นที่จัดงานได้ดี มาสเตอร์คูล
                มีพัดลมไอเย็นให้เช่า หรือพัดลมแอร์ให้เลือกใช้งานหลายขนาด
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary bg-white border-none text-black hover:bg-blue hover:text-white">
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};

export default Home;
