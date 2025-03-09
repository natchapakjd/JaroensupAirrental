import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import UserContent from '../DashboardContent/Users/UserContent'
import ProductContent from '../DashboardContent/Products/ProductContent'
import AddProduct from '../DashboardContent/Products/AddProduct'
import EditProduct from '../DashboardContent/Products/EditProducts'
import CategoryContent from '../DashboardContent/Categories/CategoryContent'
import AddCategory from '../DashboardContent/Categories/AddCategory'
import AddUser from '../DashboardContent/Users/AddUser'
import UserDetails from '../DashboardContent/Users/UserDetails'
import EditUser from '../DashboardContent/Users/EditUser'
import PageNotFound from '../authentication/PageNotFound'
import BrandContent from '../DashboardContent/Brands/BrandContent'
import AddBrand from '../DashboardContent/Brands/AddBrand'
import WarehouseContent from '../DashboardContent/Warehouses/WarehouseContent'
import AddWarehouse from '../DashboardContent/Warehouses/AddWarehouse'
import AddAttribute from '../DashboardContent/Attributes/AddAttribute'
import AttributeContent from '../DashboardContent/Attributes/AttributeContent'
import DashboardContent from './DashboardContent'
import ThreeScene from '../DashboardContent/AugmentedReality/ThreeScene'
import ReportContent from '../DashboardContent/Reports/ReportContent'
import TaskContent from '../DashboardContent/Tasks/TaskContent'
import AddTask from '../DashboardContent/Tasks/AddTask'
import EditTask from '../DashboardContent/Tasks/EditTask'
import TaskDetails from '../DashboardContent/Tasks/TaskDetails'
import AssignTask from '../DashboardContent/Tasks/AssignTask'
import HistoryLogContent from '../DashboardContent/History-logs/HistoryLogContent'
import PaymentContent from '../DashboardContent/Payments/PaymentContent'
import ReviewContent from '../DashboardContent/Reviews/ReviewContent'
import AddPayment from '../DashboardContent/Payments/AddPayment'
import EditPayment from '../DashboardContent/Payments/EditPayment'
import OrderContent from '../DashboardContent/Orders/OrderContent'
import OrderDetails from '../DashboardContent/Orders/OrderDetails'
import AddOrder from '../DashboardContent/Orders/AddOrder'
import EditOrder from '../DashboardContent/Orders/EditOrder'
import ApplicantContent from '../DashboardContent/TechnicianApplicants/ApplicantContent'
import ApplicantDetails from '../DashboardContent/TechnicianApplicants/ApplicantDetails'
import ChangePassword from '../pages/Settings/ChangePassword'
import BorrowProductContent from '../DashboardContent/BorrowProduct/BorrowProductContent'
import BorrowProductTable from '../DashboardContent/BorrowProduct/BorrowProductTable'
import ProfileSetting from '../pages/Settings/ProfileSetting'
import AddTechnician from '../DashboardContent/Users/AddTechnician'
import SendApplicantEmail from '../DashboardContent/TechnicianApplicants/SendApplicantEmail'
import LineProfile from '../pages/Settings/LineProfile'
import EditReview from '../DashboardContent/Reviews/EditReview'
import AddBorrowProduct from '../DashboardContent/BorrowProduct/AddBorrowProduct'
import UpdateTaskTech from '../DashboardContent/Tasks/UpdateTaskTech'
import EditBrand from '../DashboardContent/Brands/EditBrand'
import EditWarehouse from '../DashboardContent/Warehouses/EditWarehouse'
import AddReview from '../DashboardContent/Reviews/AddReview'
import EditAttribute from '../DashboardContent/Attributes/EditAttribute'
import EditCategory from '../DashboardContent/Categories/EditCategory'
import EditAssignmentTask from '../DashboardContent/Tasks/EditAssignmentTask'
import AddApplicant from '../DashboardContent/TechnicianApplicants/AddApplicant'
import EditApplicant from '../DashboardContent/TechnicianApplicants/EditApplicant'
import EditTechProfile from '../DashboardContent/Users/EditTechProfile'
import ApproveTask from '../DashboardContent/Tasks/ApproveTask'
import Areacal from '../DashboardContent/AugmentedReality/Areacal'
import AreacalContent from '../DashboardContent/AugmentedReality/AreacalContent'
import AddAreacal from '../DashboardContent/AugmentedReality/AddAreacal'
import EditAreacal from '../DashboardContent/AugmentedReality/EditAreacal'
import EditBorrowProduct from '../DashboardContent/BorrowProduct/EditBorrowProduct'
import AreacalDetails from '../DashboardContent/AugmentedReality/AreacalDetails'
import Setting from '../DashboardContent/Settings/Setting'
import BorrowProductDetails from '../DashboardContent/BorrowProduct/BorrowProductDetails'
import OrderDetailsLog from '../DashboardContent/Orders/OrderDetailsLog'
import AddTaskImages from '../DashboardContent/Tasks/AddTaskImages'
const DashboardRoute = () => {
  return (
      <div className='flex'>
        <Sidebar />
        <div className='w-full bg-gray-50 font-prompt '>
          <Header/>
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="settings" element={<Setting />} />
            <Route path="home" element={<DashboardContent />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="profile" element={<ProfileSetting />} />
            <Route path="line-notification" element={<LineProfile />} />
            <Route path="tasks" element={<TaskContent />} />
            <Route path="tasks/assign" element={<AssignTask />} />
            <Route path="tasks/assign/edit/:assignmentId" element={<EditAssignmentTask />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="tasks-tech/edit/:taskId" element={<UpdateTaskTech />} />
            <Route path="applicants" element={<ApplicantContent />} />
            <Route path="applicants/add" element={<AddApplicant />} />
            <Route path="applicants/edit/:applicantId" element={<EditApplicant />} />
            <Route path="applicants/:id" element={<ApplicantDetails />} />
            <Route path="applicants/sending-email/:id" element={<SendApplicantEmail />} />
            <Route path="history-log" element={<HistoryLogContent />} />
            <Route path="reviews" element={<ReviewContent />} />
            <Route path="reviews/add" element={<AddReview />} />
            <Route path="reviews/:id" element={<EditReview />} />
            <Route path="payments" element={<PaymentContent />} />
            <Route path="payments/add" element={<AddPayment />} />
            <Route path="payments/edit/:paymentId" element={<EditPayment />} />
            <Route path="borrows/:productId" element={<BorrowProductContent />} />
            <Route path="borrows" element={<BorrowProductTable />} />
            <Route path="borrows/details/:task_id" element={<BorrowProductDetails />} />
            <Route path="borrows/add" element={<AddBorrowProduct />} />
            <Route path="orders" element={<OrderContent />} />
            <Route path="orders/details/:orderId" element={<OrderDetails/>} />
            <Route path="orders/detail-log/:taskId" element={<OrderDetailsLog/>} />
            <Route path="orders/add" element={<AddOrder />} />
            <Route path="orders/edit/:orderId" element={<EditOrder />} />
            <Route path="tasks/add" element={<AddTask />} />
            <Route path="tasks/edit/:taskId" element={<EditTask />} />
            <Route path="tasks/approve/:taskId" element={<ApproveTask />} />
            <Route path="tasks/add-image/:taskId" element={<AddTaskImages />} />
            <Route path="user" element={<UserContent />} />
            {/* <Route path="augmented-reality" element={<ThreeScene />} /> */}
            <Route path="analytics" element={<ReportContent />} />
            <Route path="brands" element={<BrandContent />} />
            <Route path="brands/add" element={<AddBrand />} />
            <Route path="brands/edit/:brandId" element={<EditBrand />} />
            <Route path="warehouses" element={<WarehouseContent />} />
            <Route path="warehouses/add" element={<AddWarehouse />} />
            <Route path="warehouses/edit/:warehouseId" element={<EditWarehouse />} />
            <Route path="attributes" element={<AttributeContent />} />
            <Route path="attributes/add" element={<AddAttribute />} />
            <Route path="attributes/edit/:attributeId" element={<EditAttribute />} />
            <Route path="user/add" element={<AddUser />} />
            <Route path="user/add-tech" element={<AddTechnician />} />
            <Route path="user/edit/:userId" element={<EditUser/>} />
            <Route path="user/edit-tech/:techId" element={<EditTechProfile/>} />
            <Route path="user/:userId" element={<UserDetails/>} />
            <Route path="products" element={<ProductContent />} />
            <Route path="categories" element={<CategoryContent />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="categories/edit/:categoryId" element={<EditCategory />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:productId" element={<EditProduct />} /> 
            <Route path="area-cal" element={<Areacal />} /> 
            <Route path="area-cal/content" element={<AreacalContent />} /> 
            <Route path="area-cal/add" element={<AddAreacal />} /> 
            <Route path="area-cal/edit/:areaId" element={<EditAreacal />} /> 
            <Route path="borrows/edit/:borrowingId" element={<EditBorrowProduct />} /> 
            <Route path="area-cal/details/:area_calculation_id" element={<AreacalDetails />} />

          </Routes>
        </div>
      </div>
  )
}

export default DashboardRoute
