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
      hour12: true, // แสดงเวลาในรูปแบบ 12 ชั่วโมง
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options); // ใช้ 'th-TH' สำหรับภาษาไทย
  };
  
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options); // ใช้ 'th-TH' สำหรับภาษาไทย
  };
  
  const OrderInvoice = ({ order }) => {
    if (!order.items) {
      return <Text>กำลังโหลดข้อมูล...</Text>;
    }
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Invoice */}
          <View style={styles.section}>
            <Text style={styles.header}>ใบเสร็จรับเงิน</Text>
            <Text>รหัสออเดอร์: {order.order_id}</Text>
            <Text>ชื่อ-สกุล: {order.firstname} {order.lastname}</Text>
            <Text>วันที่สั่งซื้อ: {formatDate(order.created_at)}</Text>
            <Text>วันที่ออกใบเสร็จ: {formatDateWithMonthNameAndTime(new Date())}</Text>
          </View>
  
          {/* ตารางแสดงรายละเอียด */}
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>รหัสสินค้า</Text>
              <Text style={styles.cellHeader}>ชื่อสินค้า</Text>
              <Text style={styles.cellHeader}>จำนวน </Text>
              <Text style={styles.cellHeader}>ราคาต่อหน่วย </Text>
              <Text style={styles.cellHeader}>ราคารวม </Text>
            </View>
  
            {/* Loop through rentalDetails and display each item */}
            {order.items.map((item, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{index+1}</Text>
                <Text style={styles.cell}>{item.product_name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>{item.price}</Text>
                <Text style={styles.cell}>{item.total_price}</Text>
              </View>
            ))}
          </View>
  
          {/* สรุปยอดรวม */}
          <View style={styles.section}>
            <Text style={styles.total}>ยอดรวม: {order.total_price} บาท</Text>
          </View>
        </Page>
      </Document>
    );
  };
  
  const OrderReceipt = ({ order }) => {
    return (
      <div>
        <PDFDownloadLink
          document={<OrderInvoice order={order} />}
          fileName={`orderSummary-${order.order_id}.pdf`}
        >
          {({ loading }) =>
            loading ? <RotateCw className="animate-spin" /> : <FileText />
          }
        </PDFDownloadLink>
      </div>
    );
  };
  
  export default OrderReceipt;
  