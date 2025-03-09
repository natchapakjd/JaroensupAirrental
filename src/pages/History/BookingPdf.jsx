import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFDownloadLink,
    Font,
  } from "@react-pdf/renderer";
  import { FileText, RotateCw } from "lucide-react";
 
  // font thai ตรง src
  Font.register({
    family: "Sarabun-Regular",
    src: "/fonts/Sarabun-Regular.ttf", // ควรจะเป็น /fonts แทน /assets
  });
  
  // style Invoice
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: "Sarabun-Regular",
      fontSize: 12,
    },
    section: {
      marginBottom: 10,
    },
    header: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
    },
    cellHeader: {
      flex: 1,
      borderBottomWidth: 1,
      padding: 5,
      fontWeight: "bold",
      backgroundColor: "#f0f0f0",
    },
    cell: {
      flex: 1,
      borderBottomWidth: 1,
      padding: 5,
    },
    total: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "right",
    },
  });
  
  const formatDateWithMonthNameAndTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // 12-hour format
    };
  
    const date = new Date(dateString);
    date.setHours(date.getHours());
  
    // Return formatted date in Thai with 12-hour time format
    return date.toLocaleString("th-TH", options);
  };
  
  
  
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options); // ใช้ 'th-TH' สำหรับภาษาไทย
  };
  
  const BookingInvoice = ({ task }) => {
    if (!task.rentalDetails) {
      return <Text>กำลังโหลดข้อมูล...</Text>;
    }
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Invoice */}
          <View style={styles.section}>
            <Text style={styles.header}>ใบสรุปงานเช่า/ล้าง</Text>
            <Text>รหัสงาน: {task.task_id}</Text>
            <Text>ประเภทงาน: {task.type_name}</Text>
            <Text>ชื่อ-สกุล: {task.firstname} {task.lastname}</Text>
            <Text>สถานที่: {task.address}</Text>
            <Text>วันที่ออกใบเสร็จ: {formatDateWithMonthNameAndTime(new Date())}</Text>
            <Text>
              วันที่เริ่มงาน: {formatDate(task.rentalDetails[0].rental_start_date)}
            </Text>
            <Text>
              วันที่จบงาน: {formatDate(task.rentalDetails[0].rental_end_date)}
            </Text>
          </View>
  
          {/* ตารางแสดงรายละเอียด */}
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>รหัสสินค้า</Text>
              <Text style={styles.cellHeader}>ชื่อสินค้า</Text>
              <Text style={styles.cellHeader}>จำนวน  </Text>
            </View>
  
            {/* Loop through rentalDetails and display each item */}
            {task.rentalDetails.map((rental, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{index+1}</Text>
                <Text style={styles.cell}>{rental.product_name}</Text>
                <Text style={styles.cell}>{rental.total_quantity_used}</Text>
              </View>
            ))}
          </View>
  
          {/* สรุปยอดรวม */}
          <View style={styles.section}>
            <Text style={styles.total}>จำนวนแอร์ที่ใช้: {task.quantity_used} ตัว</Text>
            <Text style={styles.total}>ยอดรวม: {task.total} บาท</Text>
          </View>
        </Page>
      </Document>
    );
  };
  
  const BookingPDF = ({ task }) => {
    return (
      <div>
        <PDFDownloadLink
          document={<BookingInvoice task={task} />}
          fileName={`taskSummary-${task.task_id}.pdf`}
        >
          {({ loading }) =>
            loading ? <RotateCw className="animate-spin" /> : <FileText />
          }
        </PDFDownloadLink>
      </div>
    );
  };
  
  export default BookingPDF;
  